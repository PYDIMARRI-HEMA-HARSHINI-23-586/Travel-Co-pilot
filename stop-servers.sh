#!/bin/bash

echo "🔧 Quick Fix: Restarting servers on correct ports..."
echo ""

# Kill all node processes
echo "Stopping all Node processes..."
pkill -f "node.*index.js" 2>/dev/null
pkill -f "next dev" 2>/dev/null
sleep 2

echo "✅ All processes stopped"
echo ""
echo "Now run:"
echo "  ./start-servers.sh"
echo ""
echo "Or manually:"
echo "  Terminal 1: cd website-copilot/server && node index.js"
echo "  Terminal 2: cd tbo-copilot && npm run dev"
