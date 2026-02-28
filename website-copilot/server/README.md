# API Documentation

## Base URL
```
http://localhost:3000
```

## Endpoints

### 1. Parse Natural Language Query

**Endpoint:** `POST /api/parse-query`

**Description:** Converts natural language input into structured parameters.

**Request:**
```json
{
  "query": "3 rooms at Goa which are 4-star, cheap, ready to check in on 23rd Feb till 26th Feb"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "location": "goa",
    "rooms": 3,
    "star_rating": 4,
    "price_category": "cheap",
    "check_in": "2024-02-23",
    "check_out": "2024-02-26",
    "adults": 2,
    "children": 0
  }
}
```

**Error Response:**
```json
{
  "error": "Invalid request",
  "message": "Query string is required"
}
```

---

### 2. Search Hotels

**Endpoint:** `POST /api/search-hotels`

**Description:** Searches hotels based on structured parameters.

**Request:**
```json
{
  "location": "Goa",
  "rooms": 3,
  "star_rating": 4,
  "price_category": "cheap",
  "check_in": "2024-02-23",
  "check_out": "2024-02-26",
  "adults": 2,
  "children": 0
}
```

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "hotel_id": 1,
      "hotel_name": "Beach Paradise Resort",
      "city": "Goa",
      "address": "Baga Beach Road, North Goa",
      "country": "India",
      "star_rating": 4,
      "room_type_id": 101,
      "room_description": "Deluxe Room with Sea View",
      "max_adults": 2,
      "max_children": 1,
      "min_price": 3500.00,
      "max_price": 4200.00,
      "available_rooms": 5
    }
  ]
}
```

**Error Response:**
```json
{
  "error": "Validation error",
  "message": "Location is required"
}
```

---

## Price Categories

- **cheap**: ≤ ₹5,000 per night
- **moderate**: ≤ ₹10,000 per night
- **luxury**: > ₹10,000 per night

---

## Error Codes

| Status Code | Description |
|-------------|-------------|
| 400 | Bad Request - Invalid or missing parameters |
| 500 | Internal Server Error - Database or server issue |

---

## Frontend Integration Example

```typescript
import { parseAndSearch } from '@/lib/api';

// Usage
const results = await parseAndSearch("3 rooms at Goa which are 4-star, cheap");
console.log(results.data); // Array of hotels
```

---

## Testing with cURL

### Parse Query
```bash
curl -X POST http://localhost:3000/api/parse-query \
  -H "Content-Type: application/json" \
  -d '{"query": "3 rooms at Goa which are 4-star, cheap, ready to check in on 23rd Feb till 26th Feb"}'
```

### Search Hotels
```bash
curl -X POST http://localhost:3000/api/search-hotels \
  -H "Content-Type: application/json" \
  -d '{
    "location": "Goa",
    "rooms": 3,
    "star_rating": 4,
    "price_category": "cheap",
    "check_in": "2024-02-23",
    "check_out": "2024-02-26",
    "adults": 2,
    "children": 0
  }'
```
