# How to Add Credits to Your Grok API Account

## 🔗 Direct Link

Visit your team's billing page:
**https://console.x.ai/team/b4936a36-d8f7-4582-81fc-05829696add5**

## 📝 Step-by-Step Instructions

### Method 1: Via Direct Link (Fastest)

1. **Click the link above** or copy-paste into your browser
2. You'll be taken to your team's console page
3. Look for one of these sections:
   - "Billing" tab
   - "Credits" section
   - "Add Credits" button
   - "Payment Method" option

### Method 2: Via x.ai Console

1. Go to **https://console.x.ai**
2. Sign in with your account
3. Navigate to:
   - **Billing** (left sidebar or top menu)
   - OR **Settings** → **Billing**
   - OR **Team** → **Billing**
4. Look for:
   - "Add Credits" button
   - "Purchase Credits" option
   - "Add Payment Method"

### Method 3: Check for Free Trial

1. Go to **https://console.x.ai**
2. Look for banners or notifications about:
   - "Free Trial"
   - "Free Credits"
   - "Get Started Free"
3. Click to activate if available

## 💳 What to Expect

### Adding Payment Method
- Credit card or debit card
- PayPal (if supported)
- Bank account (if supported)

### Purchasing Credits
- Minimum purchase amount (varies)
- Pay-as-you-go option
- Subscription plans (if available)

### Free Trial (If Available)
- Limited free credits
- No payment method required initially
- Good for testing

## 💰 Pricing Information

Check current pricing at: **https://x.ai/pricing**

Typical costs for this feature:
- ~1000-1500 tokens per travel guide
- Cost per token varies by plan
- Monitor usage in console dashboard

## ✅ After Adding Credits

### 1. Verify Credits
- Check console dashboard
- Should show available balance
- May take a few minutes to reflect

### 2. Test API
```bash
cd website-copilot/server
node test-grok.js
```

Expected output:
```
✅ GROK_API_KEY found
✅ API connection successful!
💬 Test response about Goa:
   "Goa is famous for..."
🎉 Setup complete!
```

### 3. Start Using
```bash
# Terminal 1 - Backend
cd website-copilot/server
node index.js

# Terminal 2 - Frontend
cd tbo-copilot
npm run dev
```

### 4. Test in Browser
- Go to http://localhost:3002
- Search: "hotels in Goa"
- Click: "📍 About Goa" tab
- See AI-generated content!

## 🆘 Troubleshooting

### Can't Find Billing Section
- Try: https://console.x.ai/billing
- Or: https://console.x.ai/settings
- Or: Contact x.ai support

### Payment Declined
- Check card details
- Verify billing address
- Try different payment method
- Contact your bank

### Still No Credits After Payment
- Wait 5-10 minutes
- Refresh console page
- Check email for confirmation
- Contact x.ai support

### Free Trial Not Available
- May be region-specific
- May require verification
- Purchase minimum credits instead

## 📧 Need Help?

### x.ai Support
- Email: support@x.ai (check their website)
- Console: Look for "Help" or "Support" button
- Documentation: https://docs.x.ai

### Alternative: Contact via Twitter/X
- @xai (official account)
- May respond to DMs or mentions

## 🎯 Quick Summary

1. **Go to**: https://console.x.ai/team/b4936a36-d8f7-4582-81fc-05829696add5
2. **Find**: Billing or Credits section
3. **Add**: Payment method or purchase credits
4. **Test**: Run `node test-grok.js`
5. **Use**: Start servers and enjoy the feature!

---

**Your API key is already configured. Just add credits and you're ready!** 🚀
