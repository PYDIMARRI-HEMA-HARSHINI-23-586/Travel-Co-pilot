#!/bin/bash

echo "🚀 Starting TBO Agent Copilot..."
echo ""

# Check if PostgreSQL is running
echo "1️⃣ Checking PostgreSQL..."
if ! psql -U postgres -c '\q' 2>/dev/null; then
    echo "❌ PostgreSQL is not running"
    echo "   Start it with: brew services start postgresql (macOS)"
    exit 1
fi
echo "✅ PostgreSQL is running"
echo ""

# Check if database exists
echo "2️⃣ Checking database..."
if ! psql -U postgres -lqt | cut -d \| -f 1 | grep -qw tbo; then
    echo "❌ Database 'tbo' does not exist"
    echo "   Create it with: psql -U postgres -c 'CREATE DATABASE tbo;'"
    exit 1
fi
echo "✅ Database 'tbo' exists"
echo ""

# Kill any existing processes on ports 3000 and 3002
echo "3️⃣ Cleaning up old processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3002 | xargs kill -9 2>/dev/null || true
echo "✅ Ports cleared"
echo ""

# Start backend
echo "4️⃣ Starting backend server (port 3000)..."
cd website-copilot/server
node index.js &
BACKEND_PID=$!
cd ../..
sleep 2

# Check if backend started
if ! lsof -i:3000 >/dev/null 2>&1; then
    echo "❌ Backend failed to start"
    exit 1
fi
echo "✅ Backend running on http://localhost:3000"
echo ""

# Start frontend
echo "5️⃣ Starting frontend (port 3002)..."
cd tbo-copilot
npm run dev &
FRONTEND_PID=$!
cd ..
sleep 3

# Check if frontend started
if ! lsof -i:3002 >/dev/null 2>&1; then
    echo "❌ Frontend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi
echo "✅ Frontend running on http://localhost:3002"
echo ""

echo "🎉 All servers started successfully!"
echo ""
echo "📝 Access the application:"
echo "   🌐 Frontend: http://localhost:3002"
echo "   🔧 Backend API: http://localhost:3000"
echo ""
echo "👤 Demo Credentials:"
echo "   Agent: agent@tbo.com / password123"
echo "   Customer: john@customer.com / password123"
echo ""
echo "⚠️  Press Ctrl+C to stop all servers"
echo ""

# Wait for Ctrl+C
trap "echo ''; echo '🛑 Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo '✅ Servers stopped'; exit 0" INT

# Keep script running
wait
