CREATE TABLE Countries (
    country_id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE Hotels (
    hotel_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    country VARCHAR(255) NOT NULL,
    star_rating INTEGER,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(255)
);

CREATE TABLE RoomTypes (
    room_type_id SERIAL PRIMARY KEY,
    hotel_id INTEGER NOT NULL REFERENCES Hotels(hotel_id),
    description VARCHAR(500),
    max_adults INTEGER NOT NULL,
    max_children INTEGER NOT NULL
);

CREATE TABLE RoomAvailabilityAndPricing (
    availability_id SERIAL PRIMARY KEY,
    room_type_id INTEGER NOT NULL REFERENCES RoomTypes(room_type_id),
    date DATE NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL,
    available_rooms INTEGER NOT NULL,
    UNIQUE (room_type_id, date)
);

CREATE TABLE Trips (
    trip_id SERIAL PRIMARY KEY,
    trip_name VARCHAR(255),
    search_query_city_hotel VARCHAR(255),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    num_rooms INTEGER NOT NULL,
    num_adults INTEGER NOT NULL,
    num_children INTEGER NOT NULL,
    selected_country_id INTEGER REFERENCES Countries(country_id),
    star_rating_min INTEGER,
    budget_max DECIMAL(10, 2)
);