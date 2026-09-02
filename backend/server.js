/**
 * server.js
 *
 * Entry point for the Airbnb Clone REST API.
 *
 * Responsibilities:
 *  - Bootstrap Express with security and parsing middleware
 *  - Mount all API route groups
 *  - Connect to MongoDB via Mongoose
 *  - Provide a global error handler for unhandled errors
 *
 * Environment variables (see .env.example):
 *  MONGO_URI   – MongoDB connection string
 *  JWT_SECRET  – Secret key used to sign / verify JWTs
 *  PORT        – HTTP port (defaults to 5000)
 *  CLIENT_URLS – Comma-separated list of allowed CORS origins
 *                e.g. "http://localhost:5173,http://localhost:5174"
 */

import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";

import accommodationRoutes from "./routes/accommodationRoutes.js";
import reservationRoutes from "./routes/reservationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Load .env variables before anything else
dotenv.config();

const app = express();

// ---------------------------------------------------------------------------
// CORS — restrict to known frontend origins so the API is not open to the web
// ---------------------------------------------------------------------------
const allowedOrigins = process.env.CLIENT_URLS
  ? process.env.CLIENT_URLS.split(",").map((o) => o.trim())
  : ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. Postman, server-to-server)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: origin ${origin} is not allowed`));
      }
    },
    credentials: true,
  })
);

// Parse incoming JSON bodies
app.use(express.json());

// ---------------------------------------------------------------------------
// Routes
// ---------------------------------------------------------------------------
app.use("/api/accommodations", accommodationRoutes);
app.use("/api/reservations", reservationRoutes);
app.use("/api/users", userRoutes);

// Health-check — quick way to confirm the server is up
app.get("/", (req, res) => {
  res.json({ message: "Airbnb Clone API is running", status: "ok" });
});

// ---------------------------------------------------------------------------
// 404 — catch requests to routes that don't exist
// ---------------------------------------------------------------------------
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// ---------------------------------------------------------------------------
// Global error handler — catches any error passed via next(err) or thrown
// inside async middleware (Express 5 propagates async errors automatically)
// ---------------------------------------------------------------------------
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${req.method} ${req.originalUrl} —`, err.message);

  const statusCode = err.statusCode || err.status || 500;
  res.status(statusCode).json({
    message: err.message || "Internal server error",
    // Only expose a stack trace in development so it doesn't leak to production
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// ---------------------------------------------------------------------------
// Database connection + server start
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} (${process.env.NODE_ENV || "development"})`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1); // Exit so the process manager can restart cleanly
  });
