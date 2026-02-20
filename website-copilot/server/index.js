const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies

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

        // Filter by number of adults and children
        // This logic needs to ensure the room type can accommodate the number of guests
        query += ` AND rt.max_adults >= $${paramIndex} AND rt.max_children >= $${paramIndex + 1}`;
        queryParams.push(numAdults, numChildren);
        paramIndex += 2;


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

// Start the server
app.listen(port, () => {
    console.log(`Backend server listening at http://localhost:${port}`);
});
