const cron = require('node-cron');

function setupPriceTracking(pool) {
    // Run daily at 2 AM to record current prices
    cron.schedule('0 2 * * *', async () => {
        console.log('📊 Running daily price tracking...');
        
        try {
            const query = `
                INSERT INTO price_history (hotel_id, room_type_id, check_in_date, price, days_before_checkin)
                SELECT 
                    rt.hotel_id,
                    rap.room_type_id,
                    rap.date as check_in_date,
                    rap.price_per_night,
                    EXTRACT(DAY FROM (rap.date - CURRENT_DATE)) as days_before_checkin
                FROM RoomAvailabilityAndPricing rap
                JOIN RoomTypes rt ON rap.room_type_id = rt.room_type_id
                WHERE rap.date >= CURRENT_DATE
            `;
            
            const result = await pool.query(query);
            console.log(`✅ Tracked ${result.rowCount} price records`);
        } catch (err) {
            console.error('❌ Price tracking failed:', err);
        }
    });
    
    console.log('⏰ Price tracking cron job scheduled (daily at 2 AM)');
}

module.exports = { setupPriceTracking };
