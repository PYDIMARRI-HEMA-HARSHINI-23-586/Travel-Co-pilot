# 🤖 TBO Agent Copilot

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> AI-Powered Decision Intelligence for Hotel Booking

---

## 📌 Overview

**TBO Agent Copilot** is an AI-driven assistant designed to help travel agents and users make **faster, safer, and explainable hotel booking decisions**.

Instead of simply listing hotels, the system provides:

- Ranked recommendations
- Confidence scores
- Human-readable reasoning
- Availability alerts
- Voice + text interaction

This transforms hotel discovery from **Search → Smart Decision**.

---

## ❗ Problem Statement

Travel booking platforms typically present hundreds of hotel options with dynamic pricing and complex cancellation policies, creating **decision overload** for travel agents and customers. There is no explanation behind the recommendations, making it difficult to choose the best option.

### Core Challenge

How can we enable **intelligent, explainable, and fast hotel selection** using AI?

---

## 💡 Proposed Solution

We built an **AI Copilot for hotel decision-making** that understands natural language travel queries, scores hotels using weighted decision intelligence, explains *why* a hotel is recommended, and highlights urgency (e.g., low availability). It supports both **voice and text interaction** for a modern user experience.

---

## ✨ Key Features

### 🧠 AI Decision Engine

- Ranks hotels based on budget, location, free cancellation, and urgency.
- Outputs top-3 ranked hotels with a confidence percentage and explainable reasoning.

### 🎤 Voice + Text Interaction

- Supports both voice and text queries for improved usability.
- Demonstrates a modern AI UX with the Web Speech API.

### 📊 Explainable Recommendations

- Each recommendation includes a confidence score, plain language reasoning, and availability alerts to build trust.

### 🎨 Modern Copilot-Style UI

- Dark AI dashboard theme with suggestion chips for quick queries.
- Confidence progress bars and typing animation for AI reasoning.

---

## 🛠️ Tech Stack

| Category      | Technology                                                                                             |
|---------------|--------------------------------------------------------------------------------------------------------|
| **Frontend**  | [Next.js](https://nextjs.org/), [React](https://reactjs.org/), [Tailwind CSS](https://tailwindcss.com/) |
| **Linting**   | [ESLint](https://eslint.org/)                                                                          |
| **Language**  | [TypeScript](https://www.typescriptlang.org/)                                                          |
| **Voice API** | Web Speech API                                                                                         |


---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Google Chrome](https://www.google.com/chrome/) (for voice input support)

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/your-username/tbo-agent-copilot.git
cd tbo-agent-copilot
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## 🖥️ Usage

Enter a natural language query in the input field, for example:
> "3-star hotel in Goa under ₹6000 near beach"

Alternatively, you can click on the suggestion chips or use the voice input 🎤 to perform a search. The copilot will return ranked hotel recommendations with confidence scores and AI-generated reasoning.

---

## 🔮 Future Scope

- **Live TBO API Integration:** Connect to the TBO API for real-time hotel availability and dynamic pricing.
- **Advanced AI Personalization:** Implement user preference learning and context-aware recommendations.
- **Multi-Supplier Intelligence:** Combine hotels, flights, and packages into a unified travel decision engine.
- **Production Deployment:** Deploy as a SaaS dashboard for travel agencies and a mobile application.

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

## 🙌 Acknowledgments

Built as part of the TBO VoyageHack, focusing on AI-driven innovation in travel decision intelligence.