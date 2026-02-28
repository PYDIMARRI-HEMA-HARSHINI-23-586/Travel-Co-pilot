# Smart Price Predictions - Deployment Checklist

## ✅ Pre-Deployment Checklist

### Database Setup
- [ ] PostgreSQL is running
- [ ] Database `tbo` exists
- [ ] Original schema and data are loaded
- [ ] `price_prediction_schema.sql` has been executed
- [ ] `price_history` table exists and has data
- [ ] Verify: `SELECT COUNT(*) FROM price_history;` returns > 0

### Backend Setup
- [ ] Node.js v16+ is installed
- [ ] All dependencies installed (`npm install`)
- [ ] `node-cron` package is installed
- [ ] `pricePrediction.js` file exists
- [ ] `priceTracker.js` file exists
- [ ] `index.js` has been updated with new imports
- [ ] Backend starts without errors
- [ ] Cron job message appears: "⏰ Price tracking cron job scheduled"

### Frontend Setup
- [ ] React/Next.js dependencies installed
- [ ] `page.tsx` has been updated
- [ ] `PriceTrendChart.tsx` component exists
- [ ] Frontend builds without errors
- [ ] Frontend starts on port 3002

### API Endpoints
- [ ] `/api/price-prediction` endpoint responds
- [ ] `/api/price-trends` endpoint responds
- [ ] `/api/search-hotels` includes price predictions
- [ ] CORS is configured for frontend

## 🧪 Testing Checklist

### Manual Testing
- [ ] Search for hotels with check-in date
- [ ] Price prediction badges appear on results
- [ ] Badges show correct colors (red/blue/gray)
- [ ] Confidence scores are displayed
- [ ] Prediction details card shows factors
- [ ] "Best time to book" recommendation appears
- [ ] Predicted price change percentage is shown

### API Testing
```bash
# Test price prediction endpoint
- [ ] curl -X POST http://localhost:3000/api/price-prediction \
      -H "Content-Type: application/json" \
      -d '{"hotel":{"hotel_id":1,"room_type_id":1,"min_price":5000,"star_rating":5,"available_rooms":2},"check_in_date":"2026-03-10"}'

# Test price trends endpoint
- [ ] curl -X POST http://localhost:3000/api/price-trends \
      -H "Content-Type: application/json" \
      -d '{"hotel_id":1,"room_type_id":1,"check_in_date":"2026-03-10"}'
```

### Edge Cases
- [ ] Search without check-in date (predictions should not appear)
- [ ] Search with past dates (handle gracefully)
- [ ] Search with dates > 90 days away
- [ ] Search with dates < 7 days away
- [ ] Hotel with no historical data (handle gracefully)

## 🔍 Verification Steps

### 1. Database Verification
```sql
-- Check price history exists
SELECT COUNT(*) FROM price_history;
-- Should return > 0

-- Check data distribution
SELECT 
    COUNT(*) as records,
    MIN(recorded_at) as oldest,
    MAX(recorded_at) as newest
FROM price_history;

-- Check sample data
SELECT * FROM price_history LIMIT 5;
```

### 2. Backend Verification
```bash
# Start backend
cd website-copilot/server
node index.js

# Look for these messages:
# ✓ Connected to PostgreSQL database!
# ✓ ⏰ Price tracking cron job scheduled (daily at 2 AM)
# ✓ Backend server listening at http://localhost:3000
```

### 3. Frontend Verification
```bash
# Start frontend
cd tbo-copilot
npm run dev

# Look for:
# ✓ Ready in Xms
# ✓ Local: http://localhost:3002
```

### 4. Feature Verification
- [ ] Open http://localhost:3002
- [ ] Search: "5-star hotel in Delhi, check in 10th March till 15th March"
- [ ] Wait for results
- [ ] Verify prediction badges appear
- [ ] Click on a hotel to see details
- [ ] Check browser console for errors

## 📊 Performance Checklist

### Response Times
- [ ] Search results load in < 2 seconds
- [ ] Price predictions add < 500ms to response time
- [ ] Frontend renders smoothly
- [ ] No lag when scrolling results

### Database Performance
- [ ] Indexes are created on price_history table
- [ ] Query execution time < 100ms
- [ ] No N+1 query issues

### Memory Usage
- [ ] Backend memory usage is stable
- [ ] No memory leaks in cron job
- [ ] Frontend bundle size is reasonable

## 🐛 Common Issues & Solutions

### Issue: No predictions showing
- [ ] Check if check-in date is provided in search
- [ ] Verify price_history table has data
- [ ] Check backend logs for errors
- [ ] Ensure predictions array is not empty in API response

### Issue: Cron job not running
- [ ] Verify server is running continuously
- [ ] Check for cron initialization message
- [ ] Test manual price tracking query
- [ ] Check system time is correct

### Issue: Predictions seem wrong
- [ ] Verify historical data is realistic
- [ ] Check risk score calculation logic
- [ ] Adjust thresholds in pricePrediction.js
- [ ] Ensure date calculations are correct

### Issue: Frontend not displaying predictions
- [ ] Check browser console for errors
- [ ] Verify API response includes price_predictions
- [ ] Check component state updates
- [ ] Verify CSS classes are applied

## 📈 Monitoring Checklist

### Daily Monitoring
- [ ] Cron job runs successfully at 2 AM
- [ ] New price records are added to database
- [ ] No errors in backend logs
- [ ] API response times are normal

### Weekly Monitoring
- [ ] Review prediction accuracy
- [ ] Check database growth rate
- [ ] Analyze user engagement with predictions
- [ ] Review error logs

### Monthly Monitoring
- [ ] Evaluate prediction performance
- [ ] Fine-tune risk score weights
- [ ] Optimize database queries
- [ ] Plan feature enhancements

## 🚀 Go-Live Checklist

### Pre-Launch
- [ ] All tests passing
- [ ] Documentation is complete
- [ ] Team is trained on new feature
- [ ] Monitoring is set up
- [ ] Rollback plan is ready

### Launch
- [ ] Deploy database changes
- [ ] Deploy backend updates
- [ ] Deploy frontend updates
- [ ] Verify all services are running
- [ ] Test end-to-end flow

### Post-Launch
- [ ] Monitor error rates
- [ ] Track user engagement
- [ ] Collect user feedback
- [ ] Document any issues
- [ ] Plan iterations

## 📝 Documentation Checklist

- [ ] README.md updated with new feature
- [ ] PRICE_PREDICTION_SETUP.md is complete
- [ ] IMPLEMENTATION_SUMMARY.md is accurate
- [ ] VISUAL_GUIDE.md shows correct UI
- [ ] API documentation is updated
- [ ] Code comments are clear

## 🎯 Success Criteria

### Technical Success
- [ ] 99%+ uptime
- [ ] < 2s response time
- [ ] Zero critical bugs
- [ ] Predictions generated for 90%+ of searches

### Business Success
- [ ] Increased conversion rate
- [ ] Reduced cart abandonment
- [ ] Positive user feedback
- [ ] Competitive advantage demonstrated

## 🔐 Security Checklist

- [ ] No sensitive data in logs
- [ ] SQL injection prevention verified
- [ ] CORS properly configured
- [ ] Rate limiting considered
- [ ] Input validation in place

## ♿ Accessibility Checklist

- [ ] Color contrast meets WCAG standards
- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text for icons

---

## Final Sign-Off

- [ ] All checklist items completed
- [ ] Feature tested end-to-end
- [ ] Documentation reviewed
- [ ] Team approval obtained
- [ ] Ready for production

**Deployed by:** _______________
**Date:** _______________
**Version:** 1.0.0
