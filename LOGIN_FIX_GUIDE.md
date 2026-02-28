# 🔧 Login Fix Guide

## Problem
Login page shows "Connection error" with 404 on `/api/auth/login`

## Root Cause
Port configuration issue:
- **Backend (Express)**: Running on port 3000
- **Frontend (Next.js)**: Should run on port 3002
- **Issue**: If frontend runs on port 3000, it conflicts with backend

## Solution

### Step 1: Stop All Servers
```bash
# Kill all node processes
pkill -f node
```

### Step 2: Start Backend First
```bash
cd website-copilot/server
node index.js
```

You should see:
```
Backend server listening at http://localhost:3000
Connected to PostgreSQL database!
```

### Step 3: Start Frontend on Port 3002
```bash
cd tbo-copilot
npm run dev
```

Next.js should start on port 3002 (or 3001 if 3002 is taken).

### Step 4: Access the App
Open browser and go to:
```
http://localhost:3002/login
```

**NOT** `http://localhost:3000/login` (that's the backend)

### Step 5: Login
Use these credentials:
- **Agent**: `agent@tbo.com` / `password123`
- **Customer**: `john@customer.com` / `password123`

## How to Verify It's Working

### Check Backend is Running:
```bash
curl http://localhost:3000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@tbo.com","password":"password123"}'
```

Should return:
```json
{"success":true,"user":{"id":1,"name":"Agent Smith","email":"agent@tbo.com","role":"agent"}}
```

### Check Frontend is Running:
Open browser to `http://localhost:3002` - you should see the login page

## Common Issues

### Issue 1: "Connection error" on login
**Cause**: Backend not running
**Fix**: Start backend first (Step 2)

### Issue 2: 404 on /api/auth/login
**Cause**: Accessing wrong port (frontend instead of backend)
**Fix**: Make sure you're on `localhost:3002`, not `localhost:3000`

### Issue 3: Port already in use
**Cause**: Previous process still running
**Fix**: 
```bash
# Find process on port 3000
lsof -i :3000
# Kill it
kill -9 <PID>
```

### Issue 4: Next.js won't start on 3002
**Fix**: Check `package.json` in `tbo-copilot`:
```json
{
  "scripts": {
    "dev": "next dev -p 3002"
  }
}
```

## Architecture
```
Browser (localhost:3002)
    ↓
Next.js Frontend (port 3002)
    ↓ API calls to localhost:3000
Express Backend (port 3000)
    ↓
PostgreSQL Database
```

## Files Modified
1. `/tbo-copilot/app/login/page.tsx` - Fixed demo credentials
2. Login API calls `http://localhost:3000/api/auth/login` (correct)

## Quick Test Script
```bash
#!/bin/bash
echo "Testing backend..."
curl -s http://localhost:3000/api/auth/login \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"agent@tbo.com","password":"password123"}' | grep -q "success" && echo "✅ Backend OK" || echo "❌ Backend FAIL"

echo "Testing frontend..."
curl -s http://localhost:3002 | grep -q "TBO" && echo "✅ Frontend OK" || echo "❌ Frontend FAIL"
```

Save as `test-servers.sh` and run: `chmod +x test-servers.sh && ./test-servers.sh`
