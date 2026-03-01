const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { parseNaturalLanguageQuery } = require('./nlpParser');
const { getPricePrediction, getPriceTrends } = require('./pricePrediction');
const { setupPriceTracking } = require('./priceTracker');
const { getPlaceInfo, getNearbyPlaces } = require('./groqService');

const app = express();
const port = 3000;

// Middleware
app.use(cors({
    origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
    user: 'postgres',         // Your PostgreSQL username (e.g., 'postgres')
    host: 'localhost',
    database: 'tbo',          // Your database name (e.g., 'tbo')
    password: '',             // Your PostgreSQL password (empty if none)
    port: 5432,               // Default PostgreSQL port
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error acquiring client', err.stack);
    }
    console.log('Connected to PostgreSQL database!');
    release();
});

// Setup price tracking cron job
setupPriceTracking(pool);

// NLP Parsing Endpoint
app.post('/api/parse-query', (req, res) => {
    try {
        const { query } = req.body;
        
        if (!query || typeof query !== 'string') {
            return res.status(400).json({ 
                error: 'Invalid request', 
                message: 'Query string is required' 
            });
        }

        const parsed = parseNaturalLanguageQuery(query);
        console.log('Parsed query:', JSON.stringify(parsed, null, 2));
        
        const response = { success: true, data: parsed };
        res.json(response);
    } catch (err) {
        console.error('Error parsing query:', err);
        res.status(500).json({ 
            error: 'Parsing failed', 
            message: err.message 
        });
    }
});

// Hotel Search with Parsed Parameters
app.post('/api/search-hotels', async (req, res) => {
    try {
        const { location, rooms, star_rating, price_category, check_in, check_out, adults, children } = req.body;

        console.log('\n=== SEARCH DEBUG ===');
        console.log('Search params:', { location, rooms, star_rating, price_category, check_in, check_out, adults, children });

        // Validation
        if (!location) {
            return res.status(400).json({ 
                error: 'Validation error', 
                message: 'Location is required' 
            });
        }

        let query = `
            SELECT DISTINCT
                h.hotel_id,
                h.name AS hotel_name,
                h.city,
                h.address,
                h.country,
                h.star_rating,
                rt.room_type_id,
                rt.description AS room_description,
                rt.max_adults,
                rt.max_children,
                MIN(rap.price_per_night) as min_price,
                MAX(rap.price_per_night) as max_price,
                MIN(rap.available_rooms) as available_rooms
            FROM Hotels h
            JOIN RoomTypes rt ON h.hotel_id = rt.hotel_id
            LEFT JOIN RoomAvailabilityAndPricing rap ON rt.room_type_id = rap.room_type_id
            WHERE 1=1
        `;
        
        const queryParams = [];
        let paramIndex = 1;
        const appliedFilters = [];

        // Location filter (REQUIRED)
        query += ` AND (h.city ILIKE $${paramIndex} OR h.name ILIKE $${paramIndex})`;
        queryParams.push(`%${location}%`);
        appliedFilters.push(`Location: ${location}`);
        paramIndex++;

        // Date range filter (OPTIONAL - only if dates provided AND data exists)
        if (check_in && check_out) {
            query += ` AND (rap.date IS NULL OR rap.date BETWEEN $${paramIndex} AND $${paramIndex + 1})`;
            queryParams.push(check_in, check_out);
            appliedFilters.push(`Dates: ${check_in} to ${check_out}`);
            paramIndex += 2;
        }

        // Star rating filter (use >= for flexibility)
        if (star_rating) {
            query += ` AND h.star_rating >= $${paramIndex}`;
            queryParams.push(star_rating);
            appliedFilters.push(`Star rating >= ${star_rating}`);
            paramIndex++;
        }

        // Room capacity filter (use >= for flexibility)
        if (adults) {
            query += ` AND rt.max_adults >= $${paramIndex}`;
            queryParams.push(adults);
            appliedFilters.push(`Adults >= ${adults}`);
            paramIndex++;
        }

        if (children !== undefined && children !== null && children > 0) {
            query += ` AND rt.max_children >= $${paramIndex}`;
            queryParams.push(children);
            appliedFilters.push(`Children >= ${children}`);
            paramIndex++;
        }

        query += `
            GROUP BY h.hotel_id, h.name, h.city, h.address, h.country, h.star_rating,
                     rt.room_type_id, rt.description, rt.max_adults, rt.max_children
        `;

        // Price category filter (applied after aggregation)
        if (price_category) {
            const priceRanges = {
                cheap: 5000,
                moderate: 10000,
                luxury: 999999
            };
            const maxPrice = priceRanges[price_category.toLowerCase()] || 999999;
            query += ` HAVING MIN(rap.price_per_night) <= ${maxPrice}`;
            appliedFilters.push(`Price <= ${maxPrice}`);
        }

        query += ` ORDER BY h.star_rating ASC, min_price ASC LIMIT 20`;

        console.log('Applied filters:', appliedFilters);
        console.log('Query params:', queryParams);

        const result = await pool.query(query, queryParams);
        
        console.log('Results found:', result.rows.length);
        if (result.rows.length === 0) {
            console.log('⚠️ No results - try relaxing filters');
        }
        console.log('===================\n');
        
        // Generate AI recommendations if results found
        let aiRecommendations = [];
        let pricePredictions = [];
        
        if (result.rows.length > 0) {
            aiRecommendations = generateAIRecommendations(
                result.rows.slice(0, 5),
                { location, star_rating, price_category, adults, children }
            );
            
            // Generate price predictions for top results
            if (check_in) {
                pricePredictions = await Promise.all(
                    result.rows.slice(0, 10).map(async (hotel) => {
                        try {
                            const prediction = await getPricePrediction(pool, hotel, check_in);
                            return {
                                hotel_id: hotel.hotel_id,
                                room_type_id: hotel.room_type_id,
                                ...prediction
                            };
                        } catch (err) {
                            console.error('Prediction error for hotel:', hotel.hotel_id, err);
                            return null;
                        }
                    })
                );
                pricePredictions = pricePredictions.filter(p => p !== null);
            }
        }
        
        res.json({ 
            success: true, 
            count: result.rows.length,
            data: result.rows,
            ai_recommendations: aiRecommendations,
            price_predictions: pricePredictions
        });

    } catch (err) {
        console.error('Error executing search:', err);
        res.status(500).json({ 
            error: 'Search failed', 
            message: err.message 
        });
    }
});

// API Endpoint for Search
app.post('/api/search', async (req, res) => {
    const {
        cityHotel,
        checkInDate,
        checkOutDate,
        numRooms,
        numAdults,
        numChildren,
        nationality, // This will be the country name
        starRatingMin,
        budgetMax
    } = req.body;

    try {
        let query = `
            SELECT
                h.hotel_id,
                h.name AS hotel_name,
                h.city,
                h.address,
                h.country,
                h.star_rating,
                rt.room_type_id,
                rt.description AS room_description,
                rt.max_adults,
                rt.max_children,
                rap.date,
                rap.price_per_night,
                rap.available_rooms
            FROM
                Hotels h
            JOIN
                RoomTypes rt ON h.hotel_id = rt.hotel_id
            JOIN
                RoomAvailabilityAndPricing rap ON rt.room_type_id = rap.room_type_id
            WHERE 1=1
        `;
        const queryParams = [];
        let paramIndex = 1;

        // Filter by City or Hotel Name
        if (cityHotel) {
            query += ` AND (h.city ILIKE $${paramIndex} OR h.name ILIKE $${paramIndex})`;
            queryParams.push(`%${cityHotel}%`);
            paramIndex++;
        }

        // Filter by Check-in and Check-out Dates (availability)
        if (checkInDate && checkOutDate) {
            query += ` AND rap.date >= $${paramIndex} AND rap.date < $${paramIndex + 1} AND rap.available_rooms > 0`;
            queryParams.push(checkInDate, checkOutDate);
            paramIndex += 2;
        }

        // Filter by Nationality (Country) - assuming nationality is country name
        if (nationality) {
            query += ` AND h.country ILIKE $${paramIndex}`;
            queryParams.push(`%${nationality}%`);
            paramIndex++;
        }

        // Filter by Star Rating
        if (starRatingMin) {
            query += ` AND h.star_rating >= $${paramIndex}`;
            queryParams.push(starRatingMin);
            paramIndex++;
        }

        // Filter by Budget (this is more complex, might need to filter after aggregation or sum prices)
        // For simplicity, let's just filter by single night price for now.
        if (budgetMax) {
            query += ` AND rap.price_per_night <= $${paramIndex}`;
            queryParams.push(budgetMax);
            paramIndex++;
        }

        // Filter by number of adults and children - EXACT match only
        query += ` AND rt.max_adults = $${paramIndex}`;
        queryParams.push(numAdults);
        paramIndex += 1;
        
        query += ` AND rt.max_children = $${paramIndex}`;
        queryParams.push(numChildren);
        paramIndex += 1;


        // Group results to get hotels with matching room types and aggregate availability
        // This is a simplified approach, a real booking system would need more complex aggregation
        // or a different query strategy for exact room availability for a date range.
        query += `
            GROUP BY
                h.hotel_id, h.name, h.city, h.address, h.country, h.star_rating,
                rt.room_type_id, rt.description, rt.max_adults, rt.max_children,
                rap.date, rap.price_per_night, rap.available_rooms
            ORDER BY
                h.star_rating DESC, rap.price_per_night ASC, rap.date ASC
        `;


        const result = await pool.query(query, queryParams);
        res.json(result.rows);

    } catch (err) {
        console.error('Error executing search query', err.stack);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Price Prediction API
app.post('/api/price-prediction', async (req, res) => {
    try {
        const { hotel, check_in_date } = req.body;
        
        if (!hotel || !check_in_date) {
            return res.status(400).json({ error: 'Hotel data and check-in date required' });
        }
        
        const prediction = await getPricePrediction(pool, hotel, check_in_date);
        res.json({ success: true, prediction });
    } catch (err) {
        console.error('Error getting price prediction:', err);
        res.status(500).json({ error: 'Prediction failed' });
    }
});

// Price Trends API
app.post('/api/price-trends', async (req, res) => {
    try {
        const { hotel_id, room_type_id, check_in_date } = req.body;
        
        if (!hotel_id || !room_type_id || !check_in_date) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }
        
        const trends = await getPriceTrends(pool, hotel_id, room_type_id, check_in_date);
        res.json({ success: true, trends });
    } catch (err) {
        console.error('Error getting price trends:', err);
        res.status(500).json({ error: 'Failed to fetch trends' });
    }
});

// ============ B2B APIs ============

// Login API
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await pool.query(
            'SELECT id, name, email, role FROM users WHERE email = $1 AND password = $2',
            [email, password]
        );
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        res.json({ success: true, user: result.rows[0] });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Customer: Submit request
app.post('/api/customer/request', async (req, res) => {
    try {
        const { customer_id, request_text } = req.body;
        const result = await pool.query(
            'INSERT INTO requests (customer_id, request_text, status) VALUES ($1, $2, $3) RETURNING *',
            [customer_id, request_text, 'pending']
        );
        res.json({ success: true, request: result.rows[0] });
    } catch (err) {
        console.error('Request submission error:', err);
        res.status(500).json({ error: 'Failed to submit request' });
    }
});

// Customer: Get request status and response
app.get('/api/customer/requests/:customer_id', async (req, res) => {
    try {
        const { customer_id } = req.params;
        const result = await pool.query(
            `SELECT r.*, res.hotel_list, res.sent_to_customer 
             FROM requests r 
             LEFT JOIN responses res ON r.request_id = res.request_id 
             WHERE r.customer_id = $1 
             ORDER BY r.created_at DESC`,
            [customer_id]
        );
        res.json({ success: true, requests: result.rows });
    } catch (err) {
        console.error('Fetch requests error:', err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Agent: Get all pending requests
app.get('/api/agent/requests', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT r.*, u.name as customer_name, u.email as customer_email 
             FROM requests r 
             JOIN users u ON r.customer_id = u.id 
             WHERE r.status IN ('pending', 'processing') 
             ORDER BY r.created_at ASC`
        );
        res.json({ success: true, requests: result.rows });
    } catch (err) {
        console.error('Fetch agent requests error:', err);
        res.status(500).json({ error: 'Failed to fetch requests' });
    }
});

// Agent: Update request status
app.put('/api/agent/request/:request_id/status', async (req, res) => {
    try {
        const { request_id } = req.params;
        const { status, agent_id } = req.body;
        const result = await pool.query(
            'UPDATE requests SET status = $1, agent_id = $2, updated_at = CURRENT_TIMESTAMP WHERE request_id = $3 RETURNING *',
            [status, agent_id, request_id]
        );
        res.json({ success: true, request: result.rows[0] });
    } catch (err) {
        console.error('Update status error:', err);
        res.status(500).json({ error: 'Failed to update status' });
    }
});

// Agent: Send response to customer
app.post('/api/agent/response', async (req, res) => {
    try {
        const { request_id, hotel_list } = req.body;
        
        // Insert response
        const responseResult = await pool.query(
            'INSERT INTO responses (request_id, hotel_list, sent_to_customer) VALUES ($1, $2, $3) RETURNING *',
            [request_id, JSON.stringify(hotel_list), true]
        );
        
        // Update request status to completed
        await pool.query(
            'UPDATE requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE request_id = $2',
            ['completed', request_id]
        );
        
        res.json({ success: true, response: responseResult.rows[0] });
    } catch (err) {
        console.error('Send response error:', err);
        res.status(500).json({ error: 'Failed to send response' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});

// Get hotel details by ID
app.get('/api/hotel/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [hotelId, roomTypeId] = id.split('-');

        const query = `
            SELECT 
                h.hotel_id,
                h.name AS hotel_name,
                h.city,
                h.address,
                h.country,
                h.star_rating,
                h.contact_email,
                h.contact_phone,
                h.description,
                rt.room_type_id,
                rt.description AS room_description,
                rt.max_adults,
                rt.max_children,
                MIN(rap.price_per_night) as min_price,
                MAX(rap.price_per_night) as max_price,
                MIN(rap.available_rooms) as available_rooms
            FROM Hotels h
            JOIN RoomTypes rt ON h.hotel_id = rt.hotel_id
            JOIN RoomAvailabilityAndPricing rap ON rt.room_type_id = rap.room_type_id
            WHERE h.hotel_id = $1 AND rt.room_type_id = $2
            GROUP BY h.hotel_id, h.name, h.city, h.address, h.country, h.star_rating,
                     h.contact_email, h.contact_phone, h.description, rt.room_type_id, rt.description,
                     rt.max_adults, rt.max_children
        `;

        const result = await pool.query(query, [hotelId, roomTypeId]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Hotel not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        console.error('Error fetching hotel details:', err);
        res.status(500).json({ error: 'Failed to fetch hotel details' });
    }
});

// Book hotel
app.post('/api/book-hotel', async (req, res) => {
    try {
        const { hotel_id, room_type_id } = req.body;

        const query = `
            UPDATE RoomAvailabilityAndPricing
            SET available_rooms = available_rooms - 1
            WHERE room_type_id = $1 AND available_rooms > 0
            RETURNING *
        `;

        const result = await pool.query(query, [room_type_id]);

        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'No rooms available' });
        }

        res.json({ success: true, message: 'Hotel booked successfully' });
    } catch (err) {
        console.error('Error booking hotel:', err);
        res.status(500).json({ error: 'Booking failed' });
    }
});

// Customer: Select hotel from agent's response
app.post('/api/customer/select-hotel', async (req, res) => {
    try {
        const { request_id, customer_id, hotel_data, replace_existing } = req.body;
        
        // If replacing, cancel previous selection
        if (replace_existing) {
            await pool.query(
                `UPDATE bookings SET status = 'cancelled', updated_at = CURRENT_TIMESTAMP
                 WHERE request_id = $1 AND customer_id = $2 AND status = 'customer_selected'`,
                [request_id, customer_id]
            );
        }
        
        // Create new booking with customer_selected status
        const result = await pool.query(
            `INSERT INTO bookings (request_id, customer_id, hotel_data, status) 
             VALUES ($1, $2, $3, 'customer_selected') RETURNING *`,
            [request_id, customer_id, JSON.stringify(hotel_data)]
        );
        
        // Update request status
        await pool.query(
            `UPDATE requests SET booking_status = 'customer_selected', updated_at = CURRENT_TIMESTAMP 
             WHERE request_id = $1`,
            [request_id]
        );
        
        res.json({ success: true, booking: result.rows[0], message: 'Hotel selection sent to agent' });
    } catch (err) {
        console.error('Customer select hotel error:', err);
        res.status(500).json({ error: 'Failed to select hotel' });
    }
});

// Agent: Get pending customer selections
app.get('/api/agent/pending-selections', async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, r.request_text, u.name as customer_name, u.email as customer_email
             FROM bookings b
             JOIN requests r ON b.request_id = r.request_id
             JOIN users u ON b.customer_id = u.id
             WHERE b.status = 'customer_selected'
             ORDER BY b.created_at ASC`
        );
        res.json({ success: true, selections: result.rows });
    } catch (err) {
        console.error('Fetch pending selections error:', err);
        res.status(500).json({ error: 'Failed to fetch selections' });
    }
});

// Agent: Confirm customer's hotel selection
app.post('/api/agent/confirm-booking', async (req, res) => {
    try {
        const { booking_id, agent_id } = req.body;
        
        // Get booking details
        const bookingResult = await pool.query(
            'SELECT * FROM bookings WHERE booking_id = $1',
            [booking_id]
        );
        
        if (bookingResult.rows.length === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        
        const booking = bookingResult.rows[0];
        const hotelData = booking.hotel_data;
        
        // Update room availability
        await pool.query(
            `UPDATE RoomAvailabilityAndPricing
             SET available_rooms = available_rooms - 1
             WHERE room_type_id = $1 AND available_rooms > 0`,
            [hotelData.room_type_id]
        );
        
        // Update booking status
        await pool.query(
            `UPDATE bookings 
             SET status = 'agent_confirmed', agent_id = $1, agent_confirmed_at = CURRENT_TIMESTAMP, 
                 completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE booking_id = $2`,
            [agent_id, booking_id]
        );
        
        // Update request status
        await pool.query(
            `UPDATE requests 
             SET status = 'completed', booking_status = 'confirmed', updated_at = CURRENT_TIMESTAMP
             WHERE request_id = $1`,
            [booking.request_id]
        );
        
        res.json({ success: true, message: 'Booking confirmed successfully' });
    } catch (err) {
        console.error('Confirm booking error:', err);
        res.status(500).json({ error: 'Failed to confirm booking' });
    }
});

// Customer: Get booking status
app.get('/api/customer/bookings/:customer_id', async (req, res) => {
    try {
        const { customer_id } = req.params;
        const result = await pool.query(
            `SELECT b.*, r.request_text, u.name as agent_name
             FROM bookings b
             JOIN requests r ON b.request_id = r.request_id
             LEFT JOIN users u ON b.agent_id = u.id
             WHERE b.customer_id = $1
             ORDER BY b.created_at DESC`,
            [customer_id]
        );
        res.json({ success: true, bookings: result.rows });
    } catch (err) {
        console.error('Fetch bookings error:', err);
        res.status(500).json({ error: 'Failed to fetch bookings' });
    }
});

// Agent: Book hotel for customer
app.post('/api/agent/book-for-customer', async (req, res) => {
    try {
        const { hotel_id, room_type_id, hotel_data, request_id, customer_id, agent_id } = req.body;
        
        // Update room availability
        await pool.query(
            `UPDATE RoomAvailabilityAndPricing
             SET available_rooms = available_rooms - 1
             WHERE room_type_id = $1 AND available_rooms > 0`,
            [room_type_id]
        );
        
        // If booking for a customer request, create booking entry
        if (request_id && customer_id) {
            await pool.query(
                `INSERT INTO bookings (request_id, customer_id, hotel_data, status, agent_id, agent_confirmed_at, completed_at) 
                 VALUES ($1, $2, $3, 'agent_confirmed', $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
                [request_id, customer_id, JSON.stringify(hotel_data), agent_id]
            );
            
            // Update request status
            await pool.query(
                `UPDATE requests 
                 SET status = 'completed', booking_status = 'confirmed', updated_at = CURRENT_TIMESTAMP
                 WHERE request_id = $1`,
                [request_id]
            );
        }
        
        res.json({ success: true, message: 'Booking completed successfully' });
    } catch (err) {
        console.error('Agent booking error:', err);
        res.status(500).json({ error: 'Failed to complete booking' });
    }
});

// Grok API - Place Information
app.post('/api/place-info', async (req, res) => {
    try {
        const { place } = req.body;
        
        if (!place) {
            return res.status(400).json({ error: 'Place name is required' });
        }
        
        console.log('Fetching place info for:', place);
        const info = await getPlaceInfo(place);
        res.json(info);
    } catch (err) {
        console.error('Error getting place info:', err);
        res.status(500).json({ 
            error: 'Failed to fetch place information',
            message: err.message 
        });
    }
});

// Grok API - Nearby Places for Hotel
app.post('/api/nearby-places', async (req, res) => {
    try {
        const { hotel_name, city, address } = req.body;
        
        if (!hotel_name || !city) {
            return res.status(400).json({ error: 'Hotel name and city are required' });
        }
        
        console.log('Fetching nearby places for:', hotel_name, city);
        const nearby = await getNearbyPlaces(hotel_name, city, address || '');
        res.json(nearby);
    } catch (err) {
        console.error('Error getting nearby places:', err);
        res.status(500).json({ 
            error: 'Failed to fetch nearby places',
            message: err.message 
        });
    }
});

// Rule-based AI Recommendation Generator (No API key needed)
function generateAIRecommendations(hotels, userPreferences) {
    return hotels.map((hotel, index) => {
        let confidence = 70; // Base confidence
        const reasons = [];
        const highlights = [];

        // Star rating match
        if (userPreferences.star_rating) {
            if (hotel.star_rating === userPreferences.star_rating) {
                confidence += 15;
                reasons.push(`Perfect ${hotel.star_rating}-star match`);
            } else if (hotel.star_rating > userPreferences.star_rating) {
                confidence += 10;
                reasons.push(`Upgraded to ${hotel.star_rating}-star`);
            }
        }

        // Price category match
        if (userPreferences.price_category) {
            const priceRanges = { cheap: 5000, moderate: 10000, luxury: 999999 };
            const maxPrice = priceRanges[userPreferences.price_category];
            if (hotel.min_price <= maxPrice * 0.7) {
                confidence += 10;
                reasons.push('Great value for money');
            }
        }

        // Room capacity match
        const totalGuests = (userPreferences.adults || 2) + (userPreferences.children || 0);
        if (hotel.max_adults + hotel.max_children >= totalGuests) {
            confidence += 5;
        }

        // Position bonus (top results get higher confidence)
        if (index === 0) confidence += 10;
        else if (index === 1) confidence += 5;

        // Generate highlights based on hotel features
        if (hotel.star_rating === 5) {
            highlights.push('Premium luxury experience with world-class amenities');
        } else if (hotel.star_rating === 4) {
            highlights.push('Excellent comfort with modern facilities');
        } else if (hotel.star_rating === 3) {
            highlights.push('Quality accommodation at affordable rates');
        }

        // Price-based highlights
        if (hotel.min_price < 3000) {
            highlights.push('Budget-friendly option');
        } else if (hotel.min_price > 10000) {
            highlights.push('Premium service and exclusive amenities');
        }

        // Location highlights
        if (hotel.city.toLowerCase().includes('mumbai')) {
            highlights.push('Prime location in financial capital');
        } else if (hotel.city.toLowerCase().includes('delhi')) {
            highlights.push('Central location near major attractions');
        } else if (hotel.city.toLowerCase().includes('hyderabad')) {
            highlights.push('Tech hub with modern infrastructure');
        }

        // Build reason string
        let reason = reasons.length > 0 
            ? reasons.join(', ') + '. '
            : 'Good match for your requirements. ';
        
        reason += `Spacious rooms for ${hotel.max_adults} adults and ${hotel.max_children} children.`;

        return {
            hotel_id: hotel.hotel_id,
            hotel_name: hotel.hotel_name,
            confidence: Math.min(confidence, 98), // Cap at 98%
            reason: reason,
            highlight: highlights[0] || 'Comfortable stay with quality service'
        };
    });
}
