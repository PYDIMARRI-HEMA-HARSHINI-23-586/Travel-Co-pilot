# Smart Price Predictions Setup Guide

## 🚀 Quick Setup

### 1. Install Dependencies

```bash
cd website-copilot/server
npm install
```

This will install the new `node-cron` dependency for price tracking.

### 2. Setup Database

Run the price prediction schema to create the price history table and populate initial data:

```bash
cd website-copilot
psql -U postgres -d tbo -f price_prediction_schema.sql
```

This will:
- Create the `price_history` table
- Add indexes for performance
- Populate historical price data (simulated for last 30 days)

### 3. Restart Backend

```bash
cd website-copilot/server
node index.js
```

You should see:
```
Connected to PostgreSQL database!
⏰ Price tracking cron job scheduled (daily at 2 AM)
Backend server listening at http://localhost:3000
```

### 4. Restart Frontend

```bash
cd tbo-copilot
npm run dev
```

## ✨ Features Added

### 1. **Price Prediction Engine** (`pricePrediction.js`)
- Rule-based AI that analyzes multiple factors:
  - Days until check-in
  - Historical price trends
  - Weekend vs weekday
  - Star rating volatility
  - Room availability
  - Holiday seasons

### 2. **Automatic Price Tracking** (`priceTracker.js`)
- Cron job runs daily at 2 AM
- Records current prices to build historical data
- Tracks price changes over time

### 3. **New API Endpoints**
- `POST /api/price-prediction` - Get prediction for a specific hotel
- `POST /api/price-trends` - Get historical price trends

### 4. **Frontend Integration**
- Price prediction badges on hotel cards
- Color-coded alerts (red = increasing, blue = decreasing)
- Confidence scores
- Booking recommendations
- "Best time to book" suggestions

## 🎯 How It Works

### Price Prediction Logic

The system analyzes:

1. **Urgency Score** (Days until check-in)
   - < 7 days: High urgency (+30 points)
   - < 14 days: Medium urgency (+20 points)
   - > 60 days: Early booking (-10 points)

2. **Historical Trends**
   - Increasing trend: +25 points
   - Decreasing trend: -15 points

3. **Demand Factors**
   - Weekend: +15 points
   - Low availability (<3 rooms): +20 points
   - Luxury hotels (5-star): +10 points

4. **Final Prediction**
   - Risk score > 40: "Price likely to increase"
   - Risk score < -10: "Price may decrease"
   - Otherwise: "Price is stable"

## 📊 Testing

### Test the Feature

1. Search for hotels with dates in Feb-March 2026:
   ```
   5-star luxury hotel in Delhi, check in 10th March till 15th March
   ```

2. Look for price prediction badges on hotel cards:
   - 📈 Red badge = Price increasing (book now!)
   - 📉 Blue badge = Price may decrease (wait)
   - Gray = Stable pricing

3. Check prediction details:
   - Confidence score
   - Predicted price change %
   - Booking recommendation
   - Contributing factors

### Manual API Testing

```bash
# Get price prediction
curl -X POST http://localhost:3000/api/price-prediction \
  -H "Content-Type: application/json" \
  -d '{
    "hotel": {
      "hotel_id": 1,
      "room_type_id": 1,
      "min_price": 5000,
      "star_rating": 5,
      "available_rooms": 2
    },
    "check_in_date": "2026-03-10"
  }'

# Get price trends
curl -X POST http://localhost:3000/api/price-trends \
  -H "Content-Type: application/json" \
  -d '{
    "hotel_id": 1,
    "room_type_id": 1,
    "check_in_date": "2026-03-10"
  }'
```

## 🔧 Customization

### Adjust Prediction Sensitivity

Edit `website-copilot/server/pricePrediction.js`:

```javascript
// Make predictions more aggressive
if (riskScore > 30) { // Changed from 40
    prediction.status = 'increasing';
    // ...
}

// Adjust confidence calculation
prediction.confidence = Math.min(90, 60 + riskScore * 0.5); // Increased max
```

### Change Cron Schedule

Edit `website-copilot/server/priceTracker.js`:

```javascript
// Run every 6 hours instead of daily
cron.schedule('0 */6 * * *', async () => {
    // ...
});
```

## 📈 Future Enhancements

1. **Machine Learning Model**
   - Train on real historical data
   - More accurate predictions
   - Seasonal pattern recognition

2. **Price Alerts**
   - Email notifications when prices drop
   - SMS alerts for price increases
   - Watchlist feature

3. **Competitor Analysis**
   - Compare prices across similar hotels
   - Market positioning insights

4. **Dynamic Pricing Suggestions**
   - For hotel owners
   - Revenue optimization

## 🐛 Troubleshooting

### No predictions showing
- Check if price_history table has data: `SELECT COUNT(*) FROM price_history;`
- Ensure check-in dates are provided in search
- Check backend logs for errors

### Cron job not running
- Verify server is running continuously
- Check logs: "⏰ Price tracking cron job scheduled"
- Manually trigger: Run the INSERT query from priceTracker.js

### Predictions seem inaccurate
- More historical data needed (wait a few days)
- Adjust risk score thresholds in pricePrediction.js
- Fine-tune factor weights

## 📝 Notes

- Initial data is simulated for demonstration
- Real accuracy improves with actual historical data
- Predictions are probabilistic, not guaranteed
- System learns better over time with more data

## 🎉 Success!

You now have a fully functional Smart Price Prediction system! Users will see:
- Real-time price predictions
- Booking recommendations
- Historical trends
- Confidence scores

The system will automatically improve as it collects more data over time.
