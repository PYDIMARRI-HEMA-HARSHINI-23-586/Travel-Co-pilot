#!/bin/bash

echo "🚀 Setting up B2B Architecture..."
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

# Setup B2B database
echo "2️⃣ Setting up B2B database tables..."
cd website-copilot
psql -U postgres -d tbo -f b2b_schema.sql
if [ $? -ne 0 ]; then
    echo "❌ Failed to setup B2B database"
    exit 1
fi
echo "✅ B2B database setup complete"
echo ""

echo "🎉 B2B Setup complete!"
echo ""
echo "📋 Default Users Created:"
echo "   Agent: agent@tbo.com / password123"
echo "   Customer 1: john@customer.com / password123"
echo "   Customer 2: sarah@customer.com / password123"
echo "   Customer 3: mike@customer.com / password123"
echo ""
echo "Next steps:"
echo "1. Start backend:  cd website-copilot/server && node index.js"
echo "2. Start frontend: cd tbo-copilot && npm run dev"
echo "3. Visit: http://localhost:3002"
echo "4. Login with agent or customer credentials"
echo ""
