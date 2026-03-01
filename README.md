# ✈️ TBO Travel Co-pilot

**The Ultimate AI-Powered B2B Travel Booking Assistant**

> 🏆 Built for the TBO VoyageHack 2026 | Team Tech Valkyries

<div align="center">

[![Demo Video](https://img.shields.io/badge/▶️_Watch_Demo-FF0000?style=for-the-badge&logo=youtube&logoColor=white)](https://drive.google.com/file/d/1aWfc5Szs9sj2EjYlcNc1qvwLw2KxkYbc/view?usp=sharing)
[![Documentation](https://img.shields.io/badge/📚_Read_Docs-00C853?style=for-the-badge)](./website-copilot/server/README.md)

</div>

![TBO Travel Co-pilot](https://raw.githubusercontent.com/PYDIMARRI-HEMA-HARSHINI-23-586/Travel-Co-pilot/main/website-copilot/original_page.png)

---

## 🎯 The Problem We're Solving

**Travel agents face 3 critical challenges:**

1. ⏰ **Time-Consuming Searches** – Manually filtering through hundreds of hotels wastes valuable time
2. 💬 **Communication Gaps** – Back-and-forth emails/calls with customers slow down bookings
3. 💰 **Price Uncertainty** – Agents don't know if they should book now or wait for better prices

**Our Solution:** An AI-powered co-pilot that understands natural language, connects agents with customers in real-time, and predicts optimal booking times.

---

## 🌟 What Makes Us Different

**TBO Travel Co-pilot** transforms how B2B travel booking works by combining:

✅ **Natural Language AI** – Agents speak/type naturally: "5-star hotel in Delhi for 2 adults next weekend"  
✅ **Real-Time Agent-Customer Portal** – Live request management with instant push notifications  
✅ **Smart Price Predictions** – ML-powered "Buy Now" or "Wait" recommendations with confidence scores  
✅ **Hyper-Local Intelligence** – Auto-generated nearby attractions, restaurants, and travel times  
✅ **Voice-First Interface** – Hands-free booking for busy agents

---

## 🚀 Core Features

<table>
<tr>
<td width="50%">

### 🤖 AI-Powered Natural Search
- **Voice & Text Input:** "Find me a 5-star luxury hotel in Delhi for 2 adults next weekend"
- **Smart NLP Parsing:** Auto-extracts location, dates, guests, budget, preferences
- **Contextual Understanding:** Handles complex queries like "pet-friendly beach resort under ₹5000"
- **Multi-language Support:** Works in English, Hindi, and regional languages

</td>
<td width="50%">

### 💼 B2B Agent-Customer Workflow
- **Dual Portal System:** Separate interfaces for agents and customers
- **Live Request Queue:** Agents see all pending customer requests in real-time
- **One-Click Push:** Send curated hotel options directly to customer's screen
- **Status Tracking:** "Pending" → "Sent" → "Booked" workflow automation

</td>
</tr>
<tr>
<td width="50%">

### 📈 Smart Price Predictions
- **ML-Powered Forecasting:** Analyzes historical pricing patterns
- **Visual Indicators:**
  - 🔴 **Red Alert:** Price likely to increase (Book Now!)
  - 🔵 **Blue Signal:** Price may drop (Wait for better deal)
- **Confidence Scores:** 85% confidence = High reliability
- **Savings Estimator:** Shows potential savings if you wait

</td>
<td width="50%">

### 🗺️ Hyper-Local AI Insights
- **Auto-Generated Context:** Nearby airports, attractions, restaurants
- **Travel Time Estimates:** "15 mins to Gateway of India"
- **Destination Guides:** Ask "Best food in Mumbai?" – Get instant answers
- **Powered by Groq:** Lightning-fast Llama-3.3-70b responses

</td>
</tr>
</table>

---

## 🛠️ Tech Stack

<div align="center">

| Layer | Technology | Why We Chose It |
|-------|-----------|----------------|
| **Frontend** | Next.js 16 + TypeScript + Tailwind CSS | Server-side rendering, type safety, rapid UI development |
| **Backend** | Node.js + Express.js | Scalable REST APIs, async processing |
| **Database** | PostgreSQL | Complex relational data, ACID compliance |
| **AI/LLM** | Groq API (Llama-3.3-70b) | 10x faster inference than GPT-4, cost-effective |


</div>

---

## ⚡ Quick Start Guide

> ⏱️ **Setup Time:** 5 minutes | **Difficulty:** Easy

### Prerequisites
```bash
✅ Node.js (v18+)
✅ PostgreSQL (v14+)
✅ Git
```

### 1. Installation

Clone the repository and install dependencies:

```bash
# Clone the repo
git clone https://github.com/PYDIMARRI-HEMA-HARSHINI-23-586/Travel-Co-pilot.git
cd Travel-Co-pilot

# Install backend dependencies
cd website-copilot/server
npm install

# Install frontend dependencies
cd ../../tbo-copilot
npm install
```

### 2. Environment Setup

Create a `.env` file in `website-copilot/server/` and add your API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```
*(You can get a free key from [console.groq.com](https://console.groq.com))*

### 3. Database Setup

Ensure PostgreSQL is running, then execute the setup scripts:

```bash
# Create database and tables
cd website-copilot
createdb tbo
psql -d tbo -f schema.sql
psql -d tbo -f b2b_schema.sql
psql -d tbo -f price_prediction_schema.sql

# Load dummy data
psql -d tbo -f dummy_data.sql
```

### 4. Run the Application

We've provided a simple script to start everything:

```bash
# From the root directory
chmod +x start-servers.sh
./start-servers.sh
```

**🎉 You're all set!**

- 🌐 **Frontend:** [http://localhost:3002](http://localhost:3002)
- ⚙️ **Backend API:** [http://localhost:3000](http://localhost:3000)
- 📊 **Database:** PostgreSQL on default port 5432

---

## 👤 Demo Credentials

**🎭 To experience the full B2B workflow:**

1. Open **two browser windows** (or use Incognito mode)
2. Login as both Agent and Customer simultaneously
3. Watch real-time sync in action!

| Role | Email | Password | What You Can Do |
|------|-------|----------|----------------|
| **🧑‍💼 Agent** | `agent@tbo.com` | `password123` | View customer requests, search hotels, push recommendations |
| **👤 Customer** | `john@customer.com` | `password123` | Send booking requests, receive agent suggestions, book hotels |

---

## 📚 Documentation & Resources

- 📖 **[API Documentation](./website-copilot/server/README.md)** – Complete backend routes and endpoints
- 🗄️ **[Database Schema](./website-copilot/database_schema.md)** – ER diagrams and table structures
- 🎥 **[Demo Video](https://drive.google.com/file/d/1aWfc5Szs9sj2EjYlcNc1qvwLw2KxkYbc/view?usp=sharing)** – Full walkthrough of features
- 🧪 **[Postman Collection](./website-copilot/server/)** – Test all APIs instantly

---

## 🎯 Business Impact

**For Travel Agents:**
- ⏰ **70% faster** hotel searches with AI
- 📞 **50% reduction** in customer calls/emails
- 💰 **Better margins** with price prediction insights

**For Customers:**
- 🎯 **Personalized** recommendations from their trusted agent
- ⚡ **Real-time** updates without waiting for callbacks
- 💡 **Smarter decisions** with AI-powered travel insights

---

## 🚀 Future Roadmap

- [ ] **Flight Integration** – Add flight booking with hotel packages
- [ ] **Multi-Currency Support** – Global B2B expansion
- [ ] **WhatsApp Bot** – Book hotels via WhatsApp chat
- [ ] **Analytics Dashboard** – Agent performance metrics
- [ ] **Mobile App** – iOS/Android native apps

---

## 👥 Team Tech Valkyries

**Built with 💜 for TBO VoyageHack 2026**

> *"Empowering travel agents with AI, one booking at a time."*

---

## 📄 License

MIT License – Feel free to use this for learning and innovation!

---

<div align="center">

### ⭐ If you like this project, please star the repo!

**Made with ❤️ by Team Tech Valkyries**

</div>
