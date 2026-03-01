// Price Prediction Engine - Rule-based AI for hotel price predictions

function calculateDaysUntilCheckIn(checkInDate) {
    const today = new Date();
    const checkIn = new Date(checkInDate);
    return Math.ceil((checkIn - today) / (1000 * 60 * 60 * 24));
}

function isWeekend(date) {
    const d = new Date(date);
    return d.getDay() === 0 || d.getDay() === 6;
}

function isHolidaySeason(date) {
    const d = new Date(date);
    const month = d.getMonth();
    // Feb-March (your data range) - consider late Feb and early March as potential holiday season
    return month === 1 || month === 2;
}

async function analyzePriceTrend(pool, hotelId, roomTypeId, checkInDate) {
    const query = `
        SELECT 
            price,
            recorded_at,
            days_before_checkin
        FROM price_history
        WHERE hotel_id = $1 
        AND room_type_id = $2
        AND check_in_date = $3
        ORDER BY recorded_at DESC
        LIMIT 10
    `;
    
    const result = await pool.query(query, [hotelId, roomTypeId, checkInDate]);
    
    if (result.rows.length < 2) {
        return { trend: 'stable', changePercent: 0, dataPoints: result.rows.length };
    }
    
    const prices = result.rows.map(r => parseFloat(r.price));
    const oldest = prices[prices.length - 1];
    const newest = prices[0];
    const changePercent = ((newest - oldest) / oldest) * 100;
    
    let trend = 'stable';
    if (changePercent > 5) trend = 'increasing';
    else if (changePercent < -5) trend = 'decreasing';
    
    return { trend, changePercent, dataPoints: prices.length, prices };
}

async function getPricePrediction(pool, hotel, checkInDate) {
    const daysUntil = calculateDaysUntilCheckIn(checkInDate);
    const currentPrice = parseFloat(hotel.min_price);
    
    // Analyze historical trend
    const trendData = await analyzePriceTrend(
        pool, 
        hotel.hotel_id, 
        hotel.room_type_id, 
        checkInDate
    );
    
    let prediction = {
        status: 'stable',
        confidence: 70,
        message: 'Price is stable',
        recommendation: 'Good time to book',
        predictedChange: 0,
        predictedPrice: currentPrice,
        factors: []
    };
    
    let riskScore = 0;
    
    // Factor 1: Days until check-in (stronger impact)
    if (daysUntil < 7) {
        riskScore += 40;
        prediction.factors.push('Last minute booking - prices typically higher');
    } else if (daysUntil < 14) {
        riskScore += 25;
        prediction.factors.push('Less than 2 weeks away - limited availability');
    } else if (daysUntil > 60) {
        riskScore -= 15;
        prediction.factors.push('Early booking - prices may fluctuate');
    } else if (daysUntil > 30) {
        riskScore -= 8;
        prediction.factors.push('Good advance booking window');
    }
    
    // Factor 2: Historical trend (stronger weight)
    if (trendData.trend === 'increasing') {
        riskScore += 35;
        prediction.factors.push(`Price increased ${Math.abs(trendData.changePercent).toFixed(1)}% recently`);
    } else if (trendData.trend === 'decreasing') {
        riskScore -= 25;
        prediction.factors.push(`Price dropped ${Math.abs(trendData.changePercent).toFixed(1)}% recently`);
    }
    
    // Factor 3: Weekend pricing
    if (isWeekend(checkInDate)) {
        riskScore += 20;
        prediction.factors.push('Weekend stay - higher demand');
    }
    
    // Factor 4: Star rating (luxury hotels more volatile)
    if (hotel.star_rating >= 5) {
        riskScore += 15;
        prediction.factors.push('Luxury property - dynamic pricing');
    } else if (hotel.star_rating <= 2) {
        riskScore -= 5;
        prediction.factors.push('Budget property - stable pricing');
    }
    
    // Factor 5: Availability (stronger impact)
    if (hotel.available_rooms < 3) {
        riskScore += 30;
        prediction.factors.push('Low availability - book soon');
    } else if (hotel.available_rooms < 5) {
        riskScore += 15;
        prediction.factors.push('Limited rooms available');
    } else if (hotel.available_rooms > 10) {
        riskScore -= 12;
        prediction.factors.push('Good availability');
    }
    
    // Factor 6: Price level (add randomness based on hotel characteristics)
    const priceVariance = (hotel.hotel_id % 7) - 3; // -3 to +3 based on hotel ID
    riskScore += priceVariance * 3;
    
    // Calculate prediction with more variance
    if (riskScore > 35) {
        prediction.status = 'increasing';
        prediction.predictedChange = 8 + (riskScore - 35) * 0.6 + (Math.random() * 5);
        prediction.message = 'Price likely to increase';
        prediction.recommendation = '⚠️ Book now to lock this rate';
        prediction.confidence = Math.min(90, 65 + riskScore * 0.35);
    } else if (riskScore < -15) {
        prediction.status = 'decreasing';
        prediction.predictedChange = -4 - Math.abs(riskScore) * 0.4 - (Math.random() * 3);
        prediction.message = 'Price may decrease';
        prediction.recommendation = 'Consider waiting a few days';
        prediction.confidence = Math.min(80, 55 + Math.abs(riskScore) * 0.5);
    } else {
        prediction.status = 'stable';
        prediction.predictedChange = (Math.random() - 0.5) * 4; // -2% to +2%
        prediction.message = 'Price is stable';
        prediction.recommendation = 'Good time to book';
        prediction.confidence = 65 + Math.random() * 10;
    }
    
    prediction.predictedPrice = currentPrice * (1 + prediction.predictedChange / 100);
    
    // Best time to book recommendation
    if (daysUntil > 45) {
        prediction.bestTimeToBook = 'Wait 2-3 weeks for better rates';
    } else if (daysUntil > 21) {
        prediction.bestTimeToBook = 'Book within next 1-2 weeks';
    } else if (daysUntil > 7) {
        prediction.bestTimeToBook = 'Book within next few days';
    } else {
        prediction.bestTimeToBook = 'Book immediately';
    }
    
    return prediction;
}

async function getPriceTrends(pool, hotelId, roomTypeId, checkInDate) {
    const query = `
        SELECT 
            DATE(recorded_at) as date,
            AVG(price) as avg_price,
            MIN(price) as min_price,
            MAX(price) as max_price
        FROM price_history
        WHERE hotel_id = $1 
        AND room_type_id = $2
        AND check_in_date = $3
        GROUP BY DATE(recorded_at)
        ORDER BY date ASC
    `;
    
    const result = await pool.query(query, [hotelId, roomTypeId, checkInDate]);
    
    return result.rows.map(row => ({
        date: row.date,
        price: parseFloat(row.avg_price),
        min: parseFloat(row.min_price),
        max: parseFloat(row.max_price)
    }));
}

module.exports = {
    getPricePrediction,
    getPriceTrends,
    analyzePriceTrend
};
