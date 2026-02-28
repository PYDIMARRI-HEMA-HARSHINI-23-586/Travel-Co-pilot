# B2B Architecture Documentation

## Overview

The system has been converted from B2C to B2B with role-based access:
- **Agent Interface**: Uses existing chatbot UI to search hotels and respond to customer requests
- **Customer Interface**: New UI where customers submit requests and receive responses from agents

## Architecture Flow

```
Customer → Submit Request → Database (requests table)
                                ↓
Agent → Sees Notification → Processes Request → Searches Hotels
                                ↓
Agent → Sends Response → Database (responses table)
                                ↓
Customer → Receives Hotels → Views Results
```

## Database Schema

### Users Table
```sql
- id (Primary Key)
- name
- email (Unique)
- password
- role (agent/customer)
- created_at
```

### Requests Table
```sql
- request_id (Primary Key)
- customer_id (Foreign Key → users.id)
- agent_id (Foreign Key → users.id)
- request_text
- status (pending/processing/completed)
- created_at
- updated_at
```

### Responses Table
```sql
- response_id (Primary Key)
- request_id (Foreign Key → requests.request_id)
- hotel_list (JSONB)
- sent_to_customer (Boolean)
- created_at
```

## API Endpoints

### Authentication
- **POST** `/api/auth/login`
  - Body: `{ email, password }`
  - Returns: `{ success, user: { id, name, email, role } }`

### Customer APIs
- **POST** `/api/customer/request`
  - Body: `{ customer_id, request_text }`
  - Creates new hotel search request

- **GET** `/api/customer/requests/:customer_id`
  - Returns all requests and responses for a customer

### Agent APIs
- **GET** `/api/agent/requests`
  - Returns all pending/processing requests with customer details

- **PUT** `/api/agent/request/:request_id/status`
  - Body: `{ status, agent_id }`
  - Updates request status (pending → processing → completed)

- **POST** `/api/agent/response`
  - Body: `{ request_id, hotel_list }`
  - Sends hotel results to customer

## User Interfaces

### Login Page (`/login`)
- Email/password authentication
- Redirects to `/agent` or `/customer` based on role

### Customer Interface (`/customer`)
Features:
- Submit hotel search requests via text input
- View all submitted requests with status
- Receive and view hotel results from agent
- Auto-refresh every 5 seconds for new responses

### Agent Interface (`/agent`)
Features:
- Notification bell with pending request count
- Popup showing customer requests
- Existing chatbot UI for hotel search
- "Send to Customer" button to deliver results
- Real-time updates every 3 seconds

## Setup Instructions

### 1. Run Setup Script
```bash
./setup-b2b.sh
```

### 2. Manual Setup (Alternative)
```bash
# Import B2B schema
cd website-copilot
psql -U postgres -d tbo -f b2b_schema.sql
```

### 3. Start Services
```bash
# Terminal 1: Backend
cd website-copilot/server
node index.js

# Terminal 2: Frontend
cd tbo-copilot
npm run dev
```

### 4. Access Application
- Open: http://localhost:3002
- Login with credentials below

## Default Users

### Agent
- Email: `agent@tbo.com`
- Password: `password123`

### Customers
1. Email: `john@customer.com` / Password: `password123`
2. Email: `sarah@customer.com` / Password: `password123`
3. Email: `mike@customer.com` / Password: `password123`

## Usage Flow

### Customer Flow
1. Login as customer
2. Enter request: "5-star luxury hotel in Mumbai for 2 adults from 15th March to 20th March"
3. Click "Send Request"
4. Wait for agent response (status updates automatically)
5. View hotel results when agent sends response

### Agent Flow
1. Login as agent
2. See notification bell with pending request count
3. Click bell to view customer requests
4. Click on a request to process it
5. Request text auto-fills in search box
6. Click "Search" to find hotels using existing chatbot
7. Review results
8. Click "Send to Customer" to deliver results
9. Customer receives hotels instantly

## Key Features

### Real-time Updates
- Customer interface: Auto-refreshes every 5 seconds
- Agent interface: Auto-refreshes every 3 seconds
- No manual refresh needed

### Status Tracking
- **Pending**: Request submitted, waiting for agent
- **Processing**: Agent is working on the request
- **Completed**: Agent sent response to customer

### Notification System
- Red badge shows pending request count
- Popup displays customer name, email, and request text
- Click to process request immediately

## Technical Details

### Frontend Routes
- `/` → Redirects to `/login`
- `/login` → Authentication page
- `/customer` → Customer portal (protected)
- `/agent` → Agent dashboard (protected)

### Authentication
- Uses localStorage to store user session
- Role-based routing protection
- Auto-redirect if not authenticated

### Data Flow
- Customer requests stored in `requests` table
- Agent responses stored in `responses` table with JSONB hotel data
- Status updates trigger UI refresh on both sides

## Security Notes

⚠️ **Production Considerations**:
- Current implementation uses plain text passwords
- For production, implement:
  - bcrypt password hashing
  - JWT tokens for authentication
  - Session management
  - HTTPS/SSL
  - Rate limiting
  - Input validation

## Troubleshooting

### No notifications appearing
- Check backend is running on port 3000
- Verify database has pending requests
- Check browser console for errors

### Customer not receiving response
- Verify agent clicked "Send to Customer"
- Check `responses` table has entry
- Ensure `sent_to_customer` is true

### Login fails
- Verify database has users
- Check email/password match exactly
- Ensure backend API is accessible

## File Structure

```
Travel-Co-pilot/
├── website-copilot/
│   ├── b2b_schema.sql          # B2B database schema
│   └── server/
│       └── index.js            # Backend with B2B APIs
├── tbo-copilot/
│   └── app/
│       ├── page.tsx            # Redirects to login
│       ├── login/
│       │   └── page.tsx        # Login page
│       ├── customer/
│       │   └── page.tsx        # Customer interface
│       └── agent/
│           └── page.tsx        # Agent interface
└── setup-b2b.sh                # Setup script
```

## Next Steps

1. Test with multiple customers simultaneously
2. Add email notifications for new requests
3. Implement chat between agent and customer
4. Add booking confirmation workflow
5. Create admin panel for user management
