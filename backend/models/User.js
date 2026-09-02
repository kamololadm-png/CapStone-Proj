/**
 * User.js
 *
 * Mongoose model for user accounts.
 *
 * Roles:
 *  "user"  – A guest who can browse listings and make reservations.
 *  "host"  – A host who can additionally create, update, and delete their
 *            own accommodation listings.
 *
 * Security note: Passwords are hashed with bcryptjs in the controller before
 * being stored. This model intentionally does NOT auto-hash on save so that
 * the controller retains explicit control over when hashing occurs.
 *
 * Relationships:
 *  - Accommodations reference this model via Accommodation.host
 *  - Reservations reference this model via Reservation.user and Reservation.host
 */

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /** Display name shown in the UI (e.g. "Hi, John") */
    username: {
      type: String,
      required: [true, "Username is required"],
      trim: true,
    },

    /** Email address — used as the login identifier, must be unique */
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },

    /** bcrypt-hashed password — never returned in API responses */
    password: {
      type: String,
      required: [true, "Password is required"],
    },

    /**
     * Access role:
     *  "user" (default) – can browse and book
     *  "host"           – can also manage listings
     */
    role: {
      type: String,
      enum: {
        values: ["user", "host"],
        message: 'Role must be either "user" or "host"',
      },
      default: "user",
    },
  },
  {
    /** Automatically add createdAt and updatedAt timestamps */
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
