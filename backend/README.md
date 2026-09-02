# Airbnb Clone — Node.js Backend

A RESTful API built with **Node.js**, **Express**, and **MongoDB** (via Mongoose) that powers the Airbnb Clone application. It handles accommodation listings, user authentication (JWT), and reservation management.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
  - [Users](#users)
  - [Accommodations](#accommodations)
  - [Reservations](#reservations)
- [Authentication](#authentication)
- [Roles & Permissions](#roles--permissions)
- [Error Handling](#error-handling)

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express 5 | Web framework / routing |
| MongoDB | NoSQL database |
| Mongoose | ODM — schema definition and queries |
| bcryptjs | Password hashing |
| jsonwebtoken | JWT issuance and verification |
| dotenv | Environment variable management |
| cors | Cross-origin request handling |

---

## Project Structure

```
backend/
├── controllers/
│   ├── accommodationController.js   # CRUD for property listings
│   ├── reservationController.js     # Reservation lifecycle
│   └── userController.js            # Registration & login
├── middleware/
│   └── auth.js                      # protect (JWT guard) + hostOnly (role guard)
├── models/
│   ├── Accommodation.js             # Property listing schema
│   ├── Reservation.js               # Booking schema
│   └── User.js                      # User account schema
├── routes/
│   ├── accommodationRoutes.js
│   ├── reservationRoutes.js
│   └── userRoutes.js
├── .env.example                     # Template for required env vars
├── package.json
└── server.js                        # App bootstrap & DB connection
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- A running MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))

### Installation

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Install dependencies
npm install

# 3. Copy the environment template and fill in your values
cp .env.example .env

# 4. Start the development server
npm run dev
```

The server starts on `http://localhost:5000` by default.

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following keys:

| Variable | Description | Example |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/airbnb` |
| `JWT_SECRET` | Secret key for signing JWTs | `a_long_random_string` |
| `PORT` | Port the server listens on | `5000` |
| `CLIENT_URLS` | Comma-separated allowed CORS origins | `http://localhost:5173,http://localhost:5174` |
| `NODE_ENV` | Runtime environment | `development` or `production` |

---

## API Reference

All endpoints are prefixed with `/api`.

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/users/register` | None | Register a new user account |
| POST | `/api/users/login` | None | Log in and receive a JWT |

#### POST `/api/users/register`

**Request body:**
```json
{
  "username": "Jane Doe",
  "email": "jane@example.com",
  "password": "password123",
  "role": "host"
}
```
`role` is optional and defaults to `"user"`. Use `"host"` for admin dashboard accounts.

**Response `201`:**
```json
{
  "_id": "64f...",
  "username": "Jane Doe",
  "email": "jane@example.com",
  "role": "host",
  "token": "<JWT>"
}
```

#### POST `/api/users/login`

**Request body:**
```json
{
  "email": "jane@example.com",
  "password": "password123"
}
```

**Response `200`:** Same shape as register response.

---

### Accommodations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/accommodations` | None | List all listings (filterable, paginated) |
| GET | `/api/accommodations/:id` | None | Get a single listing |
| POST | `/api/accommodations` | Host only | Create a new listing |
| PUT | `/api/accommodations/:id` | Host + owner | Update a listing |
| DELETE | `/api/accommodations/:id` | Host + owner | Delete a listing |

#### GET `/api/accommodations` — Query parameters

| Param | Type | Description |
|---|---|---|
| `location` | string | Case-insensitive partial match on location |
| `type` | string | Case-insensitive partial match on type |
| `minPrice` | number | Minimum price per night |
| `maxPrice` | number | Maximum price per night |
| `page` | number | Page number (default: `1`) |
| `limit` | number | Results per page (default: `12`, max: `50`) |

**Response `200`:**
```json
{
  "accommodations": [...],
  "page": 1,
  "totalPages": 3,
  "total": 34
}
```

#### POST `/api/accommodations` — Request body

```json
{
  "title": "Modern Apartment in Cape Town",
  "description": "Stunning views...",
  "type": "Entire apartment",
  "location": "Cape Town",
  "guests": 4,
  "bedrooms": 2,
  "bathrooms": 1,
  "price": 850,
  "amenities": ["wifi", "kitchen"],
  "images": ["/images/ct1.jpg"],
  "weeklyDiscount": 10,
  "cleaningFee": 200,
  "serviceFee": 150,
  "occupancyTaxes": 80
}
```

---

### Reservations

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/reservations` | User | Create a reservation |
| GET | `/api/reservations/host` | Host | Get reservations on your listings |
| GET | `/api/reservations/user` | User | Get your own reservations |
| DELETE | `/api/reservations/:id` | Reservation owner | Cancel a reservation |

#### POST `/api/reservations` — Request body

```json
{
  "accommodation": "64f...",
  "checkIn": "2024-09-01",
  "checkOut": "2024-09-08",
  "guests": 2
}
```

The `totalCost` is calculated **server-side** and cannot be set by the client.

---

## Authentication

Protected routes require a `Bearer` token in the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens are valid for **7 days**. Obtain a token via `/api/users/login` or `/api/users/register`.

---

## Roles & Permissions

| Action | `user` role | `host` role |
|---|---|---|
| Browse listings | ✅ | ✅ |
| View listing details | ✅ | ✅ |
| Create a reservation | ✅ | ✅ |
| Cancel own reservation | ✅ | ✅ |
| Create a listing | ❌ | ✅ |
| Update own listing | ❌ | ✅ |
| Delete own listing | ❌ | ✅ |
| View reservations on own listings | ❌ | ✅ |

---

## Error Handling

All errors return JSON in the following format:

```json
{
  "message": "Human-readable error description"
}
```

In `development` mode, a `stack` field is also included to aid debugging.

| Status | Meaning |
|---|---|
| 400 | Bad request — missing or invalid input |
| 401 | Unauthorized — missing or invalid JWT |
| 403 | Forbidden — authenticated but not permitted |
| 404 | Resource not found |
| 500 | Internal server error |
