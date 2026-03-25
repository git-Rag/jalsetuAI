# 💧 JalSetu AI

### Smart Water Management System for Madhya Pradesh

> *“Predicting Thirst Before It Strikes”*

---

## 📌 Overview

JalSetu AI is a full-stack MERN application designed to transform water management in Madhya Pradesh from **reactive to proactive**. It predicts village-level water shortages, prioritizes tanker delivery, and generates AI-powered insights to support better decision-making.

The system is built as a **hackathon MVP** simulating real-world rural water scenarios using structured data.

---

## 🚨 Problem

* Water distribution in rural MP is often **reactive and unplanned**
* No system predicts **which village will run out of water next**
* Tankers are dispatched based on complaints instead of data
* Lack of coordination between regions leads to inefficiency

---

## 💡 Solution

JalSetu AI provides a **data-driven decision system** that:

* Predicts how many days of water each village has left
* Classifies villages into risk levels (Safe / Moderate / Critical)
* Prioritizes tanker delivery using a scoring algorithm
* Detects **dual crisis villages** (surface + groundwater risk)
* Uses AI (Groq LLaMA 8B) to generate actionable insights

---

## ⚙️ Tech Stack

* **Frontend:** React (Vite)
* **Backend:** Node.js + Express
* **AI:** Groq LLaMA 8B Instant API
* **Data:** Simulated village + groundwater dataset

---

## 🧠 Key Features

* 🔮 Water shortage prediction (days left calculation)
* 🚚 Smart tanker allocation (priority scoring)
* 🌊 Groundwater monitoring (health score + depletion)
* ⚠️ Dual crisis detection
* 🤖 AI-generated insights and recommendations

---

## 📊 Data Sources (Proposed Real Integration)

* **PHED (MP):** Tanker logs, water supply data
* **Jal Jeevan Mission:** Rural infrastructure data
* **IMD:** Rainfall data
* **CGWB:** Groundwater reports
* **Future:** IoT sensors + field-level inputs

> ⚠️ Current MVP uses simulated data for demonstration purposes.

---

## 🧩 How It Works

```mermaid
graph TD
A[Village Data] --> B[Prediction Engine]
B --> C[Risk Classification]
C --> D[Priority Scoring]
D --> E[AI Analysis (Groq)]
E --> F[Dashboard Output]
```

---

## 🚀 Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/YOUR_USERNAME/jalsetu-ai.git
cd jalsetu-ai
```

---

### 2. Setup Backend

```bash
cd backend
npm install
npm run start
```

---

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🔑 Environment Variables

Create `.env` in backend:

```env
GROQ_API_KEY=your_api_key_here
PORT=5001
```

---

## 🎯 MVP Scope

This project is built as a **hackathon MVP**, focusing on:

* Core prediction logic
* Basic prioritization
* AI explanation layer
* Simple dashboard

---

## 🏆 Impact

JalSetu AI enables:

* Early detection of water shortages
* Efficient tanker allocation
* Better coordination across villages
* Data-driven governance

---

## 📍 Target Region

Madhya Pradesh (Pilot Districts):
Sagar · Damoh · Panna · Chhatarpur · Tikamgarh · Vidisha · Raisen · Narsinghpur

---

## 🤝 Contributors

* Backend Developer
* Frontend Developer
* AI Integration

---

## 📜 License

This project is built for educational and hackathon purposes.
