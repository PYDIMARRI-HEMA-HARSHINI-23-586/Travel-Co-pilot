-- Price History Table for tracking price changes over time
CREATE TABLE IF NOT EXISTS price_history (
    id SERIAL PRIMARY KEY,
    hotel_id INT REFERENCES Hotels(hotel_id),
    room_type_id INT REFERENCES RoomTypes(room_type_id),
    check_in_date DATE,
    price DECIMAL(10,2),
    recorded_at TIMESTAMP DEFAULT NOW(),
    days_before_checkin INT
);

CREATE INDEX idx_price_history_hotel ON price_history(hotel_id);
CREATE INDEX idx_price_history_room ON price_history(room_type_id);
CREATE INDEX idx_price_history_date ON price_history(check_in_date);

-- Insert initial price history from current data (simulate past 30 days)
INSERT INTO price_history (hotel_id, room_type_id, check_in_date, price, recorded_at, days_before_checkin)
SELECT 
    rt.hotel_id,
    rap.room_type_id,
    rap.date as check_in_date,
    rap.price_per_night * (0.85 + (RANDOM() * 0.15)) as price, -- Simulate price variation
    NOW() - INTERVAL '30 days' as recorded_at,
    30 as days_before_checkin
FROM RoomAvailabilityAndPricing rap
JOIN RoomTypes rt ON rap.room_type_id = rt.room_type_id;

-- Add more historical data points (15 days ago)
INSERT INTO price_history (hotel_id, room_type_id, check_in_date, price, recorded_at, days_before_checkin)
SELECT 
    rt.hotel_id,
    rap.room_type_id,
    rap.date as check_in_date,
    rap.price_per_night * (0.90 + (RANDOM() * 0.10)) as price,
    NOW() - INTERVAL '15 days' as recorded_at,
    15 as days_before_checkin
FROM RoomAvailabilityAndPricing rap
JOIN RoomTypes rt ON rap.room_type_id = rt.room_type_id;

-- Add recent data (7 days ago)
INSERT INTO price_history (hotel_id, room_type_id, check_in_date, price, recorded_at, days_before_checkin)
SELECT 
    rt.hotel_id,
    rap.room_type_id,
    rap.date as check_in_date,
    rap.price_per_night * (0.95 + (RANDOM() * 0.05)) as price,
    NOW() - INTERVAL '7 days' as recorded_at,
    7 as days_before_checkin
FROM RoomAvailabilityAndPricing rap
JOIN RoomTypes rt ON rap.room_type_id = rt.room_type_id;
