# ✈️ TBO Travel Co-pilot

**The Ultimate AI-Powered B2B Travel Booking Assistant**

> Built for the TBO VoyageHack 2026

![TBO Travel Co-pilot](https://raw.githubusercontent.com/PYDIMARRI-HEMA-HARSHINI-23-586/Travel-Co-pilot/main/website-copilot/original_page.png)

## 🌟 Overview

**TBO Travel Co-pilot** is a next-generation B2B travel platform that empowers travel agents with AI. It bridges the gap between complex booking systems and natural human interaction, allowing agents to find the perfect hotels using natural language, voice commands, and predictive insights.

Unlike traditional booking engines, TBO Co-pilot offers a dual-interface for **Agents** and **Customers**, streamlining the communication and booking flow with real-time updates, AI-driven price predictions, and smart itinerary suggestions.

---

## 🚀 Key Features

### 🤖 1. AI-Powered Natural Search
*   **Speak or Type:** "Find me a 5-star luxury hotel in Delhi for 2 adults next weekend."
*   **Smart Parsing:** Automatically extracts location, dates, guests, and budget.
*   **Voice Support:** Integrated microphone for hands-free querying.

### 💼 2. B2B Agent & Customer Workflow
*   **Agent Portal:** Manage customer requests, view "pending" queries, and push curated hotel options directly to the customer's screen.
*   **Customer Portal:** Customers can send requests ("I need a beach resort in Goa") and receive real-time options from their agent.
*   **Real-Time Sync:** Instant status updates and notifications between agent and customer.

### 📈 3. Smart Price Predictions
*   **Buy or Wait?** AI analyzes historical data and booking trends to predict hotel prices.
*   **Visual Indicators:** 
    *   🔴 **Red:** Price likely to increase (Book Now!)
    *   🔵 **Blue:** Price may drop (Wait)
*   **Confidence Scores:** Shows the AI's confidence level in its prediction.

### 🗺️ 4. Hyper-Local AI Insights (Powered by Groq)
*   **Nearby Places:** Automatically lists airports, attractions, and restaurants near every hotel with travel times.
*   **Destination Guides:** "What's the best food in Mumbai?" – Get instant, curated travel tips and guides without leaving the app.

---

## 🛠️ Tech Stack

*   **Frontend:** Next.js 16 (React, TypeScript, Tailwind CSS)
*   **Backend:** Node.js, Express.js
*   **Database:** PostgreSQL (with complex relational schema)
*   **AI/LLM:** Groq API (Llama-3.3-70b-versatile) for intelligence
*   **Tools:** Postman, Git

---

## ⚡ Quick Start Guide

### Prerequisites
*   Node.js (v18+)
*   PostgreSQL

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
./start-servers.sh
```

*   **Frontend:** [http://localhost:3002](http://localhost:3002)
*   **Backend:** [http://localhost:3000](http://localhost:3000)

---

## 👤 Demo Credentials

To test the B2B workflow, open two different browsers (or one Incognito window):

| Role | Email | Password |
|------|-------|----------|
| **Agent** | `agent@tbo.com` | `password123` |
| **Customer** | `john@customer.com` | `password123` |

---

## 📚 Documentation

*   **[API Documentation](./website-copilot/server/README.md)** (Backend routes)
*   **[Database Schema](./website-copilot/database_schema.md)** (ER Diagram & Tables)

---

## 🏆 Hackathon Context

This project was developed to solve the challenge of **"Humanizing B2B Travel Tech"**. By integrating LLMs and predictive analytics, we transform the dry, tabular interface of traditional booking systems into an interactive, conversational, and intelligent experience that helps agents sell better and faster.

---

## 👥 Contributors

*   **Team TBO Co-pilot**

---
*Built with ❤️ for travel.*
