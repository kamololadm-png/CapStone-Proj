# Airbnb Clone — Full Stack Capstone Project

A full-stack Airbnb clone built with **React**, **Node.js / Express**, and **MongoDB**. The project consists of three independent applications that work together:

| App | Description | Default port |
|---|---|---|
| `backend/` | REST API — listings, reservations, authentication | `5000` |
| `airbnb-frontend/` | Guest-facing app — browse, search, and book stays | `5173` |
| `admin-frontend/` | Host dashboard — manage listings and view bookings | `5174` |

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [1. Backend](#1-backend)
  - [2. AirBnb Frontend (Guest App)](#2-airbnb-frontend-guest-app)
  - [3. Admin Frontend (Host Dashboard)](#3-admin-frontend-host-dashboard)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [Features](#features)
- [API Overview](#api-overview)

---

## Tech Stack

**Frontend**
- React 18 + Vite
- React Router v6
- Axios (with request interceptor for JWT)
- CSS (custom properties, responsive grid layouts)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose (ODM)
- JWT (`jsonwebtoken`) for authentication
- bcryptjs for password hashing
- CORS (restricted to known frontend origins)

---

## Project Structure

```
CapStone-Project/
├── backend/                  # Express REST API
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── .env.example
│   └── README.md             # Full API documentation
│
├── airbnb-frontend/          # Guest-facing React app
│   └── src/
│       ├── components/
│       │   └── home/         # Home page sections
│       ├── pages/
│       ├── context/          # AuthContext (JWT session)
│       └── api/              # Axios instance
│
└── admin-frontend/           # Host admin React app
    └── src/
        ├── components/
        ├── pages/
        ├── context/
        └── api/
```

---

## Prerequisites

- **Node.js** ≥ 18.x — [download](https://nodejs.org)
- **MongoDB** — local install or free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster
- **npm** ≥ 9.x (bundled with Node.js)

---

## Getting Started

Open **three separate terminals** — one for each app.

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env     # then edit .env with your values (see below)
npm run dev
```

The API will be available at `http://localhost:5000`.

### 2. AirBnb Frontend (Guest App)

```bash
cd airbnb-frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

### 3. Admin Frontend (Host Dashboard)

```bash
cd admin-frontend
npm install
npm run dev -- --port 5174
```

Open `http://localhost:5174` in your browser.

---

## Environment Variables

Create a `.env` file in the `backend/` directory. Use `.env.example` as a template:

```env
MONGO_URI=mongodb://localhost:27017/airbnb-clone
JWT_SECRET=replace_with_a_long_random_secret
PORT=5000
CLIENT_URLS=http://localhost:5173,http://localhost:5174
NODE_ENV=development
```

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret used to sign and verify JWTs |
| `PORT` | Port the Express server listens on |
| `CLIENT_URLS` | Comma-separated CORS-allowed origins |
| `NODE_ENV` | `development` (shows stack traces) or `production` |

---

## User Roles

| Role | How to create | Capabilities |
|---|---|---|
| `user` (guest) | Register in the **guest app** (role defaults to `user`) | Browse listings, make and cancel reservations |
| `host` | Register in the **admin app** (role defaults to `host`) | All guest capabilities + create, update, delete own listings; view bookings on their listings |

---

## Features

### Guest App (`airbnb-frontend`)
- Home page with Hero Banner, Inspiration cards, Discover Experiences, ShopAirbnb, Future Getaways tabs, and Footer
- **Location search** — search bar navigates to a filtered listing page
- **Location Page** — filterable by property type and max price per night
- **Location Details** — full listing view with image gallery, static info sections, and a dynamic cost calculator
- **Cost Calculator** — live breakdown: price × nights, weekly discount, cleaning fee, service fee, occupancy taxes
- **Date pickers** — minimum date set to today; check-out minimum is the day after check-in
- **Reservation booking** — requires login; creates a reservation via the API
- **My Reservations** — table view with cancel functionality

### Admin App (`admin-frontend`)
- **Login / Register** — JWT-based auth; admin accounts use the `host` role
- **My Listings** — displays only the logged-in host's listings with live filter bar (title/location search + property type dropdown)
- **Create Listing** — full 14-field form (title, description, type, location, guests, bedrooms, bathrooms, price, amenities, images, weekly discount, cleaning fee, service fee, occupancy taxes)
- **Update Listing** — pre-filled form for seamless edits
- **Delete Listing** — with confirmation prompt
- **My Reservations** — table of all bookings on the host's listings

### Backend API
- Full CRUD for accommodations with ownership checks
- Role-based access control (`hostOnly` middleware)
- Paginated and filterable `GET /api/accommodations`
- Server-side cost calculation for reservations
- JWT authentication with 7-day token expiry
- Restricted CORS, global error handler, 404 handler

---

## API Overview

See [`backend/README.md`](./backend/README.md) for the complete API reference including all endpoints, request/response shapes, and status codes.

| Resource | Base path |
|---|---|
| Users | `/api/users` |
| Accommodations | `/api/accommodations` |
| Reservations | `/api/reservations` |
