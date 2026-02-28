#!/bin/bash

echo "🚀 Setting up Smart Price Predictions..."
echo ""

# Check if PostgreSQL is running
echo "1️⃣ Checking PostgreSQL..."
if ! psql -U postgres -c '\q' 2>/dev/null; then
    echo "❌ PostgreSQL is not running or not accessible"
    echo "   Start it with: brew services start postgresql (macOS)"
    exit 1
fi
echo "✅ PostgreSQL is running"
echo ""

# Install backend dependencies
echo "2️⃣ Installing backend dependencies..."
cd website-copilot/server
npm install
if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi
echo "✅ Dependencies installed"
echo ""

# Setup database
echo "3️⃣ Setting up price prediction database..."
cd ..
psql -U postgres -d tbo -f price_prediction_schema.sql
if [ $? -ne 0 ]; then
    echo "❌ Failed to setup database"
    echo "   Make sure the 'tbo' database exists"
    exit 1
fi
echo "✅ Database setup complete"
echo ""

echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start backend:  cd website-copilot/server && node index.js"
echo "2. Start frontend: cd tbo-copilot && npm run dev"
echo "3. Visit: http://localhost:3002"
echo ""
echo "📖 See PRICE_PREDICTION_SETUP.md for detailed documentation"
