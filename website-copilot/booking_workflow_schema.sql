-- Booking workflow enhancement
-- Add bookings table to track customer selections and agent confirmations

CREATE TABLE IF NOT EXISTS bookings (
    booking_id SERIAL PRIMARY KEY,
    request_id INTEGER NOT NULL REFERENCES requests(request_id),
    customer_id INTEGER NOT NULL REFERENCES users(id),
    agent_id INTEGER REFERENCES users(id),
    hotel_data JSONB NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'customer_selected' 
        CHECK (status IN ('customer_selected', 'agent_confirmed', 'completed', 'cancelled')),
    customer_selected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    agent_confirmed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add customer_selected_hotel to responses table
ALTER TABLE responses ADD COLUMN IF NOT EXISTS customer_selected_hotel_id VARCHAR(100);
ALTER TABLE responses ADD COLUMN IF NOT EXISTS customer_selection_status VARCHAR(50) DEFAULT 'pending';

-- Update requests table to add booking status
ALTER TABLE requests ADD COLUMN IF NOT EXISTS booking_status VARCHAR(50) DEFAULT 'no_booking';
