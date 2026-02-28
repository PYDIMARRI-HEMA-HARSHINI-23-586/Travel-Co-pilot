# TBO Agent Copilot

AI-powered hotel search using natural language queries. Search hotels by simply typing what you want in plain English.

## Features

- 🗣️ Natural language search (e.g., "5-star luxury hotel in Delhi, check in 10th March till 15th March")
- 🎤 Voice input support
- 🔍 Smart parsing of location, dates, star rating, price category, and guest count
- 💰 Real-time price and availability display
- ⚡ Fast search results from PostgreSQL database
- 📈 **Smart Price Predictions** - AI-powered price forecasting with booking recommendations
- 🌍 **NEW: AI Travel Info** - Dynamic destination guides powered by Grok API

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Project Structure

```
Travel-Co-pilot/
├── tbo-copilot/          # Frontend (Next.js)
└── website-copilot/      # Backend (Express.js + PostgreSQL)
    └── server/
```

## Setup Instructions

### Quick Setup for Price Predictions (NEW!)

Run the automated setup script:

```bash
./setup-price-predictions.sh
```

Or follow manual steps below:

### Quick Setup for AI Travel Info (NEW!)

1. Get your Grok API key from [x.ai](https://x.ai)
2. Add to `website-copilot/server/.env`:
   ```
   GROK_API_KEY=xai-your-key-here
   ```
3. Restart backend server

See [GROK_TRAVEL_INFO_SETUP.md](GROK_TRAVEL_INFO_SETUP.md) for details.

### 1. Database Setup

```bash
# Start PostgreSQL service
# macOS: brew services start postgresql
# Linux: sudo systemctl start postgresql

# Create database
psql postgres
CREATE DATABASE tbo;
\q

# Import schema and data
cd website-copilot
psql -U postgres -d tbo -f schema.sql
psql -U postgres -d tbo -f dummy_data.sql
```

### 2. Backend Setup

```bash
cd website-copilot/server

# Install dependencies
npm install

# Update database credentials in server/index.js if needed:
# - user: 'postgres'
# - password: '' (your PostgreSQL password)
# - database: 'tbo'

# Start backend server
node index.js
```

Backend will run on **http://localhost:3000**

### 3. Frontend Setup

```bash
cd tbo-copilot

# Install dependencies
npm install

# Start frontend
npm run dev
```

Frontend will run on **http://localhost:3002**

## Usage

1. Open browser and go to **http://localhost:3002**
2. Type your search query in natural language, for example:
   - "5-star luxury hotel in Delhi, check in 10th March till 15th March"
   - "Budget hotel in Mumbai, 4-star, 2 adults, 15th Feb to 18th Feb"
   - "Cheap 3-star hotel in Hyderabad, check in 20th Feb till 25th Feb"
3. Click **Ask AI** or use the 🎤 microphone button for voice input
4. View results with prices, ratings, and availability

## Sample Queries

```
5-star luxury hotel in Delhi for 2 adults, check in 10th March till 15th March
Budget hotel in Hyderabad, 4-star, check in 20th Feb till 25th Feb
Cheap 3-star hotel in Jeju City, 2 adults 1 child, 5th March to 10th March
Luxury hotel in Mumbai, 5-star, check in 1st March till 5th March
4-star hotel in Busan, moderate price, 2 adults, 15th Feb to 20th Feb
```

## Available Locations

- **India**: Mumbai, Delhi, Hyderabad
- **South Korea**: Busan, Jeju City, Incheon

## Date Range

Database contains availability for **February - March 2026**

## Troubleshooting

### Backend won't start
- Check PostgreSQL is running: `psql postgres`
- Verify database exists: `\l` in psql
- Check port 3000 is free: `lsof -i :3000`

### Frontend won't start
- Check port 3002 is free
- Delete `.next` folder and restart: `rm -rf .next && npm run dev`

### No search results
- Verify dates are in Feb-March 2026
- Check backend terminal for query logs
- Ensure database has data: `psql -d tbo -c "SELECT COUNT(*) FROM Hotels;"`

## Tech Stack

- **Frontend**: Next.js 16, React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **NLP**: Custom regex-based parser

## API Endpoints

- `POST /api/parse-query` - Parse natural language to structured params
- `POST /api/search-hotels` - Search hotels with filters

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for details.

## License

Built for TBO VoyageHack
