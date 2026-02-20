   1. `Countries` Table
       * country_id (Primary Key, Integer)
       * name (VARCHAR(255), UNIQUE)

   2. `Hotels` Table
       * hotel_id (Primary Key, Integer)
       * name (VARCHAR(255))
       * city (VARCHAR(255))
       * address (TEXT)
       * country (VARCHAR(255))
       * star_rating (INTEGER, e.g., 1 to 5)
       * contact_email (VARCHAR(255), Nullable)
       * contact_phone (VARCHAR(255), Nullable)

   3. `RoomTypes` Table (Defines different types of rooms a hotel offers)
       * room_type_id (Primary Key, Integer)
       * hotel_id (Foreign Key to Hotels.hotel_id)
       * description (VARCHAR(500))
       * max_adults (INTEGER)
       * max_children (INTEGER)

   4. `RoomAvailabilityAndPricing` Table (For daily availability and pricing)
       * availability_id (Primary Key, Integer)
       * room_type_id (Foreign Key to RoomTypes.room_type_id)
       * date (DATE)
       * price_per_night (DECIMAL)
       * available_rooms (INTEGER)
       * Compound Unique Key: `(room_type_id, date)`


   5. `Trips` Table (To save user's searches or planned trips)
       * trip_id (Primary Key, Integer)
       * trip_name (VARCHAR(255), Nullable - from "Give name to your trip")
       * search_query_city_hotel (VARCHAR(255))
       * check_in_date (DATE)
       * check_out_date (DATE)
       * num_rooms (INTEGER)
       * num_adults (INTEGER)
       * num_children (INTEGER)
       * selected_country_id (Foreign Key to Countries.country_id, Nullable)
       * star_rating_min (INTEGER, Nullable) - From "Star Rating" filter
       * budget_max (DECIMAL, Nullable) - From "Budget" filter


  Relationships Summary:
   * Countries can be referenced by many Trips.
   * Hotels has many RoomTypes.
   * RoomTypes has many RoomAvailabilityAndPricing entries.