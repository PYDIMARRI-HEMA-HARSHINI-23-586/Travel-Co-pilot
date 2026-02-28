-- Insert new Hotels for Busan (South Korea)
INSERT INTO Hotels (hotel_id, name, city, address, country, star_rating, contact_email, contact_phone) VALUES
(112, 'Lotte Hotel Busan', 'Busan', '437, Gaya-daero, Busanjin-gu', 'South Korea', 5, 'info.busan@lotte.net', '+82518101000'),
(113, 'Park Hyatt Busan', 'Busan', '51, Marine City 1-ro, Haeundae-gu', 'South Korea', 5, 'busan.parkhyatt@hyatt.com', '+82519901234'),
(114, 'ibis Styles Ambassador Busan City Centre', 'Busan', '22, Dongcheon-ro, Busanjin-gu', 'South Korea', 4, 'HA6G7-RE@accor.com', '+82516401100');

-- Insert new Hotels for Jeju City (South Korea)
INSERT INTO Hotels (hotel_id, name, city, address, country, star_rating, contact_email, contact_phone) VALUES
(115, 'Grand Hyatt Jeju', 'Jeju City', '1, Nohyeong 8-gil, Jeju-si', 'South Korea', 5, 'jeju.grandhyatt@hyatt.com', '+82649071234'),
(116, 'Jeju Shinhwa World Hotels & Resorts', 'Jeju City', '38, Shinhwayeoksa-ro 304bon-gil, Andeok-myeon', 'South Korea', 4, 'info@shinhwaworld.com', '+82649088888'),
(117, 'Jeju Ocean Palace Hotel', 'Jeju City', '19, Tapdong-ro, Jeju-si', 'South Korea', 3, 'info@oceanpalace.co.kr', '+82647503000');

-- Insert new Hotels for Incheon (South Korea)
INSERT INTO Hotels (hotel_id, name, city, address, country, star_rating, contact_email, contact_phone) VALUES
(118, 'Grand Hyatt Incheon', 'Incheon', '208, Yeongjonghaeannam-ro 321beon-gil, Jung-gu', 'South Korea', 5, 'incheon.grandhyatt@hyatt.com', '+82327451234'),
(119, 'Paradise City', 'Incheon', '186, Yeongjonghaeannam-ro 321beon-gil, Jung-gu', 'South Korea', 5, 'info@paradisecity.co.kr', '+82327292000'),
(120, 'Holiday Inn Express Incheon Euhwang-ri', 'Incheon', '36, Airport Town 3-ro 108beon-gil, Jung-gu', 'South Korea', 3, 'info@hiexpress-incheon.com', '+82327450000');

-- Insert Hotels for Hyderabad (India)
INSERT INTO Hotels (hotel_id, name, city, address, country, star_rating, contact_email, contact_phone) VALUES
(121, 'Taj Falaknuma Palace', 'Hyderabad', 'Engine Bowli, Falaknuma', 'India', 5, 'falaknuma.hyderabad@tajhotels.com', '+914066298585'),
(122, 'ITC Kohenur', 'Hyderabad', 'HITEC City, Madhapur', 'India', 5, 'itckohenur@itchotels.in', '+914067666666'),
(123, 'Novotel Hyderabad Convention Centre', 'Hyderabad', 'P.O. Bag 1101, HITEC City', 'India', 4, 'H3271@accor.com', '+914067813939');

-- Insert Hotels for Mumbai (India)
INSERT INTO Hotels (hotel_id, name, city, address, country, star_rating, contact_email, contact_phone) VALUES
(124, 'The Taj Mahal Palace', 'Mumbai', 'Apollo Bunder', 'India', 5, 'tmh.mumbai@tajhotels.com', '+912266653366'),
(125, 'The Oberoi Mumbai', 'Mumbai', 'Nariman Point', 'India', 5, 'reservations.tob@oberoigroup.com', '+912266326060'),
(126, 'Hotel Marine Plaza', 'Mumbai', '29, Marine Drive', 'India', 4, 'info@hotelmarineplaza.com', '+912222851212');

-- Insert Hotels for Delhi (India)
INSERT INTO Hotels (hotel_id, name, city, address, country, star_rating, contact_email, contact_phone) VALUES
(127, 'The Leela Palace New Delhi', 'Delhi', 'Diplomatic Enclave, Chanakyapuri', 'India', 5, 'reservations.newdelhi@theleela.com', '+911139331234'),
(128, 'The Imperial New Delhi', 'Delhi', 'Janpath', 'India', 5, 'imperial@theimperialindia.com', '+911123341234'),
(129, 'Radisson Blu Plaza Delhi Airport', 'Delhi', 'National Highway 8', 'India', 4, 'info.delhiairport@radissonblu.com', '+911142222222');


-- Insert new RoomTypes for Busan Hotels
INSERT INTO RoomTypes (room_type_id, hotel_id, description, max_adults, max_children) VALUES
(22, 112, 'Standard Twin Room', 2, 0),
(23, 112, 'Deluxe Double City View', 2, 1),
(24, 113, 'Park King', 2, 1),
(25, 113, 'Park Deluxe Suite', 3, 2),
(26, 114, 'Standard Room Queen Bed', 2, 0),
(27, 114, 'Superior Room Twin', 2, 1);

-- Insert new RoomTypes for Jeju City Hotels
INSERT INTO RoomTypes (room_type_id, hotel_id, description, max_adults, max_children) VALUES
(28, 115, 'Grand King', 2, 1),
(29, 115, 'Grand Suite Ocean View', 3, 2),
(30, 116, 'Shinhwa Room', 2, 1),
(31, 116, 'Family Suite', 4, 2),
(32, 117, 'Standard Double', 2, 0),
(33, 117, 'Ocean View Twin', 2, 1);

-- Insert new RoomTypes for Incheon Hotels
INSERT INTO RoomTypes (room_type_id, hotel_id, description, max_adults, max_children) VALUES
(34, 118, 'Grand King Room', 2, 1),
(35, 118, 'Club Twin Room', 2, 2),
(36, 119, 'Deluxe Room', 2, 1),
(37, 119, 'Pool Villa Suite', 4, 2),
(38, 120, 'Standard Queen Room', 2, 0),
(39, 120, 'Standard Twin Room', 2, 1);

-- Insert RoomTypes for Hyderabad Hotels
INSERT INTO RoomTypes (room_type_id, hotel_id, description, max_adults, max_children) VALUES
(40, 121, 'Single Room', 1, 0),
(75, 121, 'Single Room with Child', 1, 1),
(76, 121, 'Single Family Room', 1, 2),
(77, 121, 'Standard Room', 2, 0),
(41, 121, 'Deluxe Room', 2, 1),
(58, 121, 'Family Room', 2, 2),
(59, 121, 'Palace Suite', 3, 2),
(42, 122, 'Single Room', 1, 0),
(78, 122, 'Single Room with Child', 1, 1),
(79, 122, 'Single Family Room', 1, 2),
(80, 122, 'Standard Room', 2, 0),
(43, 122, 'Premium Room', 2, 1),
(60, 122, 'Family Suite', 2, 2),
(61, 122, 'Executive Suite', 3, 2),
(44, 123, 'Single Room', 1, 0),
(81, 123, 'Single Room with Child', 1, 1),
(82, 123, 'Single Family Room', 1, 2),
(83, 123, 'Standard Room', 2, 0),
(45, 123, 'Superior Room', 2, 1),
(62, 123, 'Family Room', 2, 2),
(63, 123, 'Executive Room', 2, 2);

-- Insert RoomTypes for Mumbai Hotels
INSERT INTO RoomTypes (room_type_id, hotel_id, description, max_adults, max_children) VALUES
(46, 124, 'Single Room', 1, 0),
(84, 124, 'Single Room with Child', 1, 1),
(85, 124, 'Single Family Room', 1, 2),
(86, 124, 'Standard Room', 2, 0),
(47, 124, 'Deluxe Room', 2, 1),
(64, 124, 'Family Room', 2, 2),
(65, 124, 'Grand Presidential Suite', 4, 2),
(48, 125, 'Single Room', 1, 0),
(87, 125, 'Single Room with Child', 1, 1),
(88, 125, 'Single Family Room', 1, 2),
(89, 125, 'Standard Room', 2, 0),
(49, 125, 'Premier Room', 2, 1),
(66, 125, 'Family Suite', 2, 2),
(67, 125, 'Luxury Suite', 3, 2),
(50, 126, 'Single Room', 1, 0),
(90, 126, 'Single Room with Child', 1, 1),
(91, 126, 'Single Family Room', 1, 2),
(92, 126, 'Standard Room', 2, 0),
(51, 126, 'Deluxe Sea View', 2, 1),
(68, 126, 'Family Room', 2, 2);

-- Insert RoomTypes for Delhi Hotels
INSERT INTO RoomTypes (room_type_id, hotel_id, description, max_adults, max_children) VALUES
(52, 127, 'Single Room', 1, 0),
(93, 127, 'Single Room with Child', 1, 1),
(94, 127, 'Single Family Room', 1, 2),
(95, 127, 'Standard Room', 2, 0),
(53, 127, 'Grand Deluxe Room', 2, 1),
(69, 127, 'Family Room', 2, 2),
(70, 127, 'Royal Suite', 3, 2),
(54, 128, 'Single Room', 1, 0),
(96, 128, 'Single Room with Child', 1, 1),
(97, 128, 'Single Family Room', 1, 2),
(98, 128, 'Standard Room', 2, 0),
(55, 128, 'Luxury Room', 2, 1),
(71, 128, 'Family Suite', 2, 2),
(72, 128, 'Imperial Suite', 3, 2),
(56, 129, 'Single Room', 1, 0),
(99, 129, 'Single Room with Child', 1, 1),
(100, 129, 'Single Family Room', 1, 2),
(101, 129, 'Standard Room', 2, 0),
(57, 129, 'Business Class Room', 2, 1),
(73, 129, 'Family Room', 2, 2),
(74, 129, 'Premium Room', 2, 2);


-- Insert RoomAvailabilityAndPricing for February and March 2026
INSERT INTO RoomAvailabilityAndPricing (room_type_id, date, price_per_night, available_rooms)
SELECT 
    room_type_id,
    generate_series('2026-02-01'::date, '2026-03-31'::date, '1 day'::interval)::date AS date,
    CASE room_type_id
        WHEN 22 THEN 130.00 WHEN 23 THEN 180.00 WHEN 24 THEN 250.00 WHEN 25 THEN 400.00
        WHEN 26 THEN 90.00 WHEN 27 THEN 95.00 WHEN 28 THEN 280.00 WHEN 29 THEN 450.00
        WHEN 30 THEN 150.00 WHEN 31 THEN 300.00 WHEN 32 THEN 70.00 WHEN 33 THEN 85.00
        WHEN 34 THEN 200.00 WHEN 35 THEN 380.00 WHEN 36 THEN 300.00 WHEN 37 THEN 600.00
        WHEN 38 THEN 80.00 WHEN 39 THEN 85.00 WHEN 40 THEN 250.00 WHEN 41 THEN 350.00
        WHEN 42 THEN 180.00 WHEN 43 THEN 220.00 WHEN 44 THEN 100.00 WHEN 45 THEN 140.00
        WHEN 46 THEN 300.00 WHEN 47 THEN 400.00 WHEN 48 THEN 280.00 WHEN 49 THEN 380.00
        WHEN 50 THEN 90.00 WHEN 51 THEN 160.00 WHEN 52 THEN 250.00 WHEN 53 THEN 320.00
        WHEN 54 THEN 220.00 WHEN 55 THEN 280.00 WHEN 56 THEN 110.00 WHEN 57 THEN 150.00
        WHEN 58 THEN 450.00 WHEN 59 THEN 800.00 WHEN 60 THEN 280.00 WHEN 61 THEN 450.00
        WHEN 62 THEN 180.00 WHEN 63 THEN 200.00 WHEN 64 THEN 500.00 WHEN 65 THEN 1200.00
        WHEN 66 THEN 480.00 WHEN 67 THEN 750.00 WHEN 68 THEN 200.00 WHEN 69 THEN 400.00
        WHEN 70 THEN 900.00 WHEN 71 THEN 350.00 WHEN 72 THEN 650.00 WHEN 73 THEN 190.00
        WHEN 74 THEN 210.00 WHEN 75 THEN 280.00 WHEN 76 THEN 320.00 WHEN 77 THEN 300.00
        WHEN 78 THEN 200.00 WHEN 79 THEN 240.00 WHEN 80 THEN 200.00 WHEN 81 THEN 120.00
        WHEN 82 THEN 160.00 WHEN 83 THEN 120.00 WHEN 84 THEN 320.00 WHEN 85 THEN 360.00
        WHEN 86 THEN 350.00 WHEN 87 THEN 300.00 WHEN 88 THEN 340.00 WHEN 89 THEN 330.00
        WHEN 90 THEN 100.00 WHEN 91 THEN 140.00 WHEN 92 THEN 100.00 WHEN 93 THEN 270.00
        WHEN 94 THEN 310.00 WHEN 95 THEN 280.00 WHEN 96 THEN 240.00 WHEN 97 THEN 280.00
        WHEN 98 THEN 250.00 WHEN 99 THEN 130.00 WHEN 100 THEN 170.00 WHEN 101 THEN 130.00
    END AS price_per_night,
    CASE room_type_id
        WHEN 22 THEN 15 WHEN 23 THEN 10 WHEN 24 THEN 12 WHEN 25 THEN 5
        WHEN 26 THEN 20 WHEN 27 THEN 18 WHEN 28 THEN 8 WHEN 29 THEN 4
        WHEN 30 THEN 15 WHEN 31 THEN 6 WHEN 32 THEN 25 WHEN 33 THEN 20
        WHEN 34 THEN 10 WHEN 35 THEN 6 WHEN 36 THEN 12 WHEN 37 THEN 3
        WHEN 38 THEN 30 WHEN 39 THEN 25 WHEN 40 THEN 12 WHEN 41 THEN 8
        WHEN 42 THEN 15 WHEN 43 THEN 10 WHEN 44 THEN 18 WHEN 45 THEN 12
        WHEN 46 THEN 15 WHEN 47 THEN 10 WHEN 48 THEN 18 WHEN 49 THEN 12
        WHEN 50 THEN 22 WHEN 51 THEN 15 WHEN 52 THEN 15 WHEN 53 THEN 10
        WHEN 54 THEN 20 WHEN 55 THEN 15 WHEN 56 THEN 25 WHEN 57 THEN 18
        WHEN 58 THEN 6 WHEN 59 THEN 3 WHEN 60 THEN 8 WHEN 61 THEN 5
        WHEN 62 THEN 10 WHEN 63 THEN 8 WHEN 64 THEN 8 WHEN 65 THEN 2
        WHEN 66 THEN 6 WHEN 67 THEN 4 WHEN 68 THEN 12 WHEN 69 THEN 8
        WHEN 70 THEN 3 WHEN 71 THEN 6 WHEN 72 THEN 4 WHEN 73 THEN 10
        WHEN 74 THEN 8 WHEN 75 THEN 10 WHEN 76 THEN 8 WHEN 77 THEN 10
        WHEN 78 THEN 12 WHEN 79 THEN 10 WHEN 80 THEN 12 WHEN 81 THEN 15
        WHEN 82 THEN 12 WHEN 83 THEN 15 WHEN 84 THEN 12 WHEN 85 THEN 10
        WHEN 86 THEN 12 WHEN 87 THEN 15 WHEN 88 THEN 12 WHEN 89 THEN 15
        WHEN 90 THEN 20 WHEN 91 THEN 15 WHEN 92 THEN 20 WHEN 93 THEN 12
        WHEN 94 THEN 10 WHEN 95 THEN 12 WHEN 96 THEN 18 WHEN 97 THEN 15
        WHEN 98 THEN 18 WHEN 99 THEN 22 WHEN 100 THEN 18 WHEN 101 THEN 22
    END AS available_rooms
FROM RoomTypes
WHERE room_type_id BETWEEN 22 AND 101;
