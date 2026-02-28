# 🧪 Quick Test Guide - Complete Booking Workflow

## Setup
```bash
# Stop all servers
pkill -f node

# Start backend
cd website-copilot/server
node index.js

# Start frontend (new terminal)
cd tbo-copilot
npm run dev
```

## Test Scenario: Complete Booking Flow

### 🎭 Act 1: Customer Submits Request

1. **Open browser:** http://localhost:3002/login
2. **Login as customer:**
   - Email: `john@customer.com`
   - Password: `password123`
3. **Submit request:**
   ```
   5-star luxury hotel in Delhi for 2 adults, check in 10th March till 15th March 2026
   ```
4. **✅ Verify:** See "Request sent" and status shows "pending"

---

### 🎭 Act 2: Agent Processes Request

1. **Open new browser tab/window:** http://localhost:3002/login
2. **Login as agent:**
   - Email: `agent@tbo.com`
   - Password: `password123`
3. **✅ Verify:** Notification bell shows "1" (red badge)
4. **Click bell** → See customer request
5. **Click on request** → Request loads in search box
6. **Click "Search"** → Hotels appear
7. **Click "✉️ Send to Customer"**
8. **✅ Verify:** Alert "Response sent to customer!"

---

### 🎭 Act 3: Customer Selects Hotel

1. **Switch to customer tab**
2. **Wait 5 seconds** (auto-refresh)
3. **✅ Verify:** See "✅ Agent Response (X hotels found)"
4. **Click "📋 View Details"** on any hotel
5. **✅ Verify:** Modal opens with full hotel details
6. **Close modal**
7. **Click "✅ Select This Hotel"**
8. **✅ Verify:** 
   - Alert: "Hotel selection sent to agent for confirmation!"
   - Scroll down to see "🎫 My Bookings" section
   - Booking shows status "⏳ Pending Agent"

---

### 🎭 Act 4: Agent Confirms Booking

1. **Switch to agent tab**
2. **Wait 3 seconds** (auto-refresh)
3. **✅ Verify:** Notification bell shows "1" with GREEN section
4. **Click bell** → See "✅ Customer Selections (1)"
5. **✅ Verify:** Shows:
   - Customer name
   - Selected hotel
   - Price
6. **Click "✅ Confirm Booking"**
7. **✅ Verify:**
   - Alert: "Booking confirmed! Customer has been notified."
   - Task appears in "Completed Tasks" sidebar (left side)

---

### 🎭 Act 5: Customer Sees Confirmation

1. **Switch to customer tab**
2. **Wait 5 seconds** (auto-refresh)
3. **✅ Verify in "My Bookings":**
   - Status changed to "✅ Confirmed"
   - Shows agent name: "Agent Smith"
   - Shows confirmation timestamp

---

## 🎯 Success Criteria

✅ Customer can submit request  
✅ Agent receives notification  
✅ Agent can search and send hotels  
✅ Customer receives hotel list  
✅ Customer can view hotel details  
✅ Customer can select a hotel  
✅ Agent receives selection notification  
✅ Agent can confirm booking  
✅ Customer sees confirmation  
✅ Task appears in agent's completed tasks  

---

## 🐛 Troubleshooting

### No notifications appearing
- Check browser console for errors
- Verify backend is running on port 3000
- Check database connection

### Hotels not showing
- Use dates in Feb-March 2026
- Use cities: Mumbai, Delhi, Hyderabad, Busan, Jeju City

### Booking not confirming
- Check database has bookings table
- Run: `psql -U postgres -d tbo -f booking_workflow_schema.sql`

---

## 📸 What to Show in Demo

1. **Split screen:** Customer on left, Agent on right
2. **Show real-time updates:** Notifications appearing
3. **Highlight acknowledgments:** Alerts and status changes
4. **Show completed tasks:** Agent's productivity tracking
5. **Emphasize workflow:** Customer → Agent → Confirmation

This demonstrates a true "Virtual Travel Agent Copilot"! 🚀
