# Munnar Project Backend

A backend service built with Node.js and PostgreSQL, designed to support tourism-related applications.  
Currently includes a health check endpoint connected to a PostgreSQL database with a basic `users` table.  
The project is structured to scale and extend into modules like bookings, accommodations, activities, alerts, and more.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (>=16)
- PostgreSQL (Neon, Supabase, or any Postgres hosting)

### Installation
1. Clone the repository:
    
    git clone https://github.com/<your-username>/munnar-backend.git
    cd munnar-backend

2. Install dependencies:
    
    npm install

3. Create a `.env` file in the root folder with:
    
    DATABASE_URL=your_postgres_connection_string
    PORT=3000

4. Start the server locally:
    
    npm start

---

## 📡 API Endpoints
- `GET /health` → Returns service status and database connectivity.

---

## 📂 Project Structure

    munnar-backend/
    │── .gitignore
    │── README.md
    │── package.json
    │── index.js          # Entry point
    │── .env              # Environment variables (not pushed to git)
    │
    ├── src/              # Main application code
    │   ├── config/       # Database and app configuration
    │   ├── routes/       # API route handlers
    │   ├── controllers/  # Business logic
    │   ├── models/       # Database models (tables/entities)
    │   └── utils/        # Helper functions
    │
    └── tests/            # Future test cases

This structure keeps code modular and easy to maintain as the project grows.
- **`config/`** → DB connection, environment setup
- **`routes/`** → API endpoints (e.g., `/users`, `/bookings`)
- **`controllers/`** → Core logic for each feature
- **`models/`** → Database interaction (SQL/ORM)
- **`utils/`** → Common helpers (e.g., date formatter, validators)

---
