-- Clear all data for fresh demo
DELETE FROM bookings;
DELETE FROM responses;
DELETE FROM requests;
DELETE FROM price_history;

-- Reset sequences
ALTER SEQUENCE bookings_booking_id_seq RESTART WITH 1;
ALTER SEQUENCE responses_response_id_seq RESTART WITH 1;
ALTER SEQUENCE requests_request_id_seq RESTART WITH 1;
ALTER SEQUENCE price_history_id_seq RESTART WITH 1;
