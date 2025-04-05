# 🧠 Sales Intel Frontend

This is the **frontend** of the Sales Intelligence App built using **Next.js**. It connects to a FastAPI backend to display sales data and provides an interactive AI assistant for business insights.

---

## 🚀 Features

- 📋 Paginated list of Sales Representatives
- 🔍 Search functionality by name or role
- 💬 AI Chat Assistant (via FastAPI + OpenAI)
- ⚡ Realtime interface using modern React hooks
- 🎨 Minimalist, responsive UI

---

## 🗂 Project Structure
frontend/ ├── components/ │ ├── Chat.js │ ├── ClientDealList.js │ ├── ClientList.js │ ├── ClientModal.js │ ├── Header.js │ └── SalesRepCard.js │ ├── pages/ │ ├── 404.js │ ├── _app.js │ ├── index.js │ ├── sales-reps/ │ │ └── [rep_id].js │ ├── public/ ├── styles/ ├── package.json └── README.md


---

## 📦 Getting Started

### 1. Clone the Repository

```bash
cd coding-test
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Running the App Locally
```bash
npm run dev
```

### 4. Run only Frontend Compose
```bash
docker-compose -f docker-compose.yml up --build
```
