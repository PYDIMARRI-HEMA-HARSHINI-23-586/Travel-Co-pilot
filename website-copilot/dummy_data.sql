-- Insert into Countries
INSERT INTO Countries (country_id, name) VALUES
(1, 'India'),
(2, 'South Korea'),
(3, 'United States'),
(4, 'United Kingdom');

-- Insert into Hotels
INSERT INTO Hotels (hotel_id, name, city, address, country, star_rating, contact_email, contact_phone) VALUES
(101, 'The Grand Hyatt', 'Delhi', 'NH-8, Mahipalpur', 'India', 5, 'info.delhi@grandhyatt.com', '+911126771234'),
(102, 'Seoul Shilla Hotel', 'Seoul', '249 Dongho-ro, Jung-gu', 'South Korea', 5, 'info@shilla.net', '+82222333131'),
(103, 'Budget Stay NYC', 'New York', '123 Main St, Midtown', 'United States', 3, 'nyc@budgetstay.com', '+12125551234'),
(104, 'Riverside Inn', 'London', 'Thames Path, Canary Wharf', 'United Kingdom', 4, 'reservations@riversideinn.co.uk', '+442071234567'),
(105, 'Goa Beach Resort', 'Goa', 'Palolem Beach', 'India', 4, 'info@goabeachresort.com', '+918322643000');

-- Insert into RoomTypes
INSERT INTO RoomTypes (room_type_id, hotel_id, description, max_adults, max_children) VALUES
(1, 101, 'Deluxe King Room with City View', 2, 1),
(2, 101, 'Executive Suite with Club Lounge Access', 2, 2),
(3, 102, 'Standard Double Room', 2, 0),
(4, 102, 'Family Suite with Garden View', 3, 2),
(5, 103, 'Economy Single Room', 1, 0),
(6, 103, 'Standard Double Room', 2, 1),
(7, 104, 'River View Queen Room', 2, 1),
(8, 105, 'Garden Cottage', 2, 2),
(9, 105, 'Sea View Villa', 3, 3);

-- Insert into RoomAvailabilityAndPricing (sample data for Feb-March 2026)
INSERT INTO RoomAvailabilityAndPricing (availability_id, room_type_id, date, price_per_night, available_rooms) VALUES
(1, 1, '2026-02-25', 150.00, 5),
(2, 1, '2026-02-26', 155.00, 4),
(3, 2, '2026-02-25', 300.00, 2),
(4, 3, '2026-03-01', 120.00, 10),
(5, 3, '2026-03-02', 125.00, 8),
(6, 4, '2026-03-01', 250.00, 3),
(7, 7, '2026-02-28', 180.00, 7),
(8, 7, '2026-03-01', 190.00, 6),
(9, 8, '2026-03-05', 90.00, 12),
(10, 8, '2026-03-06', 95.00, 10);

-- Insert into Trips (sample searches)
INSERT INTO Trips (trip_id, trip_name, search_query_city_hotel, check_in_date, check_out_date, num_rooms, num_adults, num_children, selected_country_id, star_rating_min, budget_max) VALUES
(1, 'Delhi Family Trip', 'Delhi', '2026-02-25', '2026-02-27', 1, 2, 1, 1, 4, 500.00),
(2, 'Seoul Solo Adventure', 'Seoul', '2026-03-01', '2026-03-03', 1, 1, 0, 2, 3, 300.00),
(3, 'NYC Business Travel', 'New York', '2026-03-10', '2026-03-12', 1, 1, 0, 3, 3, 400.00),
(4, 'London Getaway', 'London', '2026-02-28', '2026-03-02', 1, 2, 0, 4, 4, 700.00);