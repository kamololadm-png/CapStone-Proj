# Airbnb Clone — Capstone Project

A full-stack Airbnb clone with three applications:

- **airbnb-frontend** — Guest-facing site (browse, book, manage reservations)
- **admin-frontend** — Host dashboard (create, update, delete listings)
- **backend** — REST API (Node.js, Express, MongoDB)

## Prerequisites

- Node.js 18+
- MongoDB running locally or a MongoDB Atlas connection string

## Setup

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Edit `.env` with your MongoDB URI and JWT secret, then start the server:

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### 2. Guest Frontend

```bash
cd airbnb-frontend
npm install
npm run dev
```

Runs at `http://localhost:5173` by default.

### 3. Admin Frontend

```bash
cd admin-frontend
npm install
npm run dev
```

Runs at `http://localhost:5174` (or the next available Vite port).

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/register` | Register a new user |
| POST | `/api/users/login` | Log in and receive a JWT |
| GET | `/api/accommodations` | List all accommodations |
| GET | `/api/accommodations/:id` | Get one accommodation |
| POST | `/api/accommodations` | Create listing (auth required) |
| PUT | `/api/accommodations/:id` | Update listing (auth required, owner only) |
| DELETE | `/api/accommodations/:id` | Delete listing (auth required, owner only) |
| POST | `/api/reservations` | Create reservation (auth required) |
| GET | `/api/reservations/user` | Get current user's reservations |
| GET | `/api/reservations/host` | Get reservations for host's listings |
| DELETE | `/api/reservations/:id` | Cancel reservation (auth required) |

## Tech Stack

- **Frontend:** React, Vite, React Router, Axios, CSS
- **Backend:** Node.js, Express, Mongoose, JWT, bcryptjs
- **Database:** MongoDB
