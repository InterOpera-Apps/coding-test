# 🧠 Sales Intelligence API

An intelligent backend API built with **FastAPI** to manage and analyze **Sales Representatives**, **Deals**, and **Clients** — with seamless integration to **AI-powered chat** (OpenAI GPT-3.5-turbo). Designed for scalable frontend integration (e.g. Next.js) with support for pagination, search, and real-time AI queries.

---

## 🚀 Features

### 📋 Sales Management
- **Get all sales reps** with pagination and search
- **Fetch individual sales rep** by ID
- **Track deal count** per sales rep
- **View client details** by sales rep and contact

### 💬 AI Assistant
- Ask natural-language questions like:
  - _"Which sales rep has the most clients?"_
  - _"Show me deals from the west region"_
- Powered by **OpenAI GPT** with internal sales data context

### 🛠️ Utilities
- **Custom Logger** – Centralized `LOGGER` used across the backend for consistent, structured logging and easier debugging

## ⚙️ How to Run

### ▶️ Manual Run

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```
2. **Set OpenAI API Key (if using AI assistant)**
   ```bash
   export OPENAI_API_KEY=your-api-key
   ```
3. **Run the FastAPI server**
   ```bash
   uvicorn main:app --reload
   ```
4. **Visit API docs http://localhost:8000/docs**

### ▶️ Run with Docker
1. **Build the Docker**
   ```bash
   docker-compose up --build
   ```
2. **Visit API docs http://localhost:8000/docs**

### 🔌 API Endpoints

| Method | Endpoint                     | Description                                 |
|--------|------------------------------|---------------------------------------------|
| GET    | `/api/sales-reps`           | List all sales reps (with pagination)       |
| GET    | `/api/sales-reps/{rep_id}`  | Get a specific sales rep                    |
| GET    | `/api/deal-count/{rep_id}`  | Get deal count by sales rep                 |
| GET    | `/api/clients/{rep_id}/{contact}` | Get client info by sales rep & contact |
| POST   | `/api/ai`                   | Ask AI anything based on sales data         |

---

## 🧩 Tech Stack

- **FastAPI** – High performance web framework
- **OpenAI** – GPT-3.5-turbo for AI chat
- **JSON** or other – Local storage (or replaceable with any DB)
- **Next.js (Frontend)** – Real-time interface with WebSocket/Chat


## 📘 API Documentation

### 🧾 Get All Sales Reps (with Pagination)

**Endpoint**: `GET /api/sales-reps`

**Query Parameters**:

| Name  | Type | Description             | Default |
|-------|------|-------------------------|---------|
| page  | int  | Page number             | 1       |
| limit | int  | Number of items per page| 5       |

**Example Request**:

```http
GET /api/sales-reps?page=1&limit=5

{
  "sales_reps": [
    {
      "id": 1,
      "name": "Jane Doe",
      "role": "Account Manager",
      "region": "East",
      "skills": ["Negotiation", "CRM"]
    },
    ...
  ],
  "total": 42,
  "page": 1,
  "limit": 5
}
```

### 🔍 Get Sales Rep by ID

**Endpoint**: `GET /api/sales-reps/{rep_id}`

**Path Parameters**:

| Name    | Type   | Description                      |
|---------|--------|----------------------------------|
| rep_id  | string | ID of the sales representative   |

**Validation**:
- The `rep_id` must be a digit. Non-digit IDs will result in a `400 Bad Request`.

**Example Request**:

```http
GET /api/sales-reps/1

{
  "id": 1,
  "name": "Jane Doe",
  "role": "Account Manager",
  "region": "East",
  "skills": ["Negotiation", "CRM"],
  "clients": [
    {
      "name": "Acme Corp",
      "industry": "Technology",
      "contact": "alice@acme.com",
      "value": 50000,
      "status": "Negotiation"
    }
  ]
}
```

### 📊 Get Deal Count by Sales Rep ID

**Endpoint**: `GET /api/deal-count/{rep_id}`

**Path Parameters**:

| Name    | Type   | Description                                |
|---------|--------|--------------------------------------------|
| rep_id  | string | ID of the sales representative to query    |

**Note**:  
- The `rep_id` is cast to an integer. If invalid, the server may raise a `500 Internal Server Error`.

**Example Request**:

```http
GET /api/deal-count/2

{
  "rep_id": 2,
  "total_deals": 10,
  "closed_deals": 7,
  "pending_deals": 3
}
```
### 👤 Get Client by Sales Rep ID and Contact

**Endpoint**: `GET /api/clients/{rep_id}/{contact}`

**Path Parameters**:

| Name    | Type   | Description                                         |
|---------|--------|-----------------------------------------------------|
| rep_id  | int    | ID of the sales representative                      |
| contact | string | Contact identifier (e.g., email or phone number)   |

**Example Request**:

```http
GET /api/clients/2/john.doe@example.com

{
  "id": 101,
  "name": "John Doe",
  "industry": "Technology",
  "contact": "john.doe@example.com",
  "rep_id": 2
}

```

### 🤖 Ask AI About Sales Data

**Endpoint**: `POST /api/ai`

**Description**:  
This endpoint allows users to ask a natural language question. The backend uses OpenAI’s Chat API (GPT-3.5-turbo) to respond intelligently using internal sales data (sales reps, deals, and clients).

**Request Body**:

| Field     | Type   | Required | Description                      |
|-----------|--------|----------|----------------------------------|
| question  | string | Yes      | The user's question for the AI   |

**Example Request**:

```http
POST /api/ai
Content-Type: application/json

{
  "question": "Who is the best performing sales rep in the North region?"
}

```
