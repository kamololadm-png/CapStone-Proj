/**
 * Reservation.js
 *
 * Mongoose model for accommodation reservations (bookings).
 *
 * Relationships:
 *  - accommodation → Accommodation  (the property being booked)
 *  - user          → User           (the guest who made the booking)
 *  - host          → User           (the host who owns the accommodation)
 *
 * Note: The host field is denormalised from the Accommodation document at
 * creation time. This allows efficient host-side queries without needing to
 * join through the Accommodation collection.
 */

import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    /** The accommodation being reserved */
    accommodation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Accommodation",
      required: [true, "Accommodation reference is required"],
    },

    /** The guest who made the reservation */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
    },

    /**
     * The host of the accommodation — denormalised here so hosts can query
     * all reservations on their listings with a single find() call.
     */
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host reference is required"],
    },

    /** Guest's intended check-in date */
    checkIn: {
      type: Date,
      required: [true, "Check-in date is required"],
    },

    /** Guest's intended check-out date — must be after checkIn (enforced in controller) */
    checkOut: {
      type: Date,
      required: [true, "Check-out date is required"],
    },

    /** Number of guests for this stay */
    guests: {
      type: Number,
      required: [true, "Guest count is required"],
      min: [1, "At least 1 guest is required"],
    },

    /**
     * Total cost calculated server-side at booking time.
     * Formula: (nights × price) − weeklyDiscount + cleaningFee + serviceFee + occupancyTaxes
     */
    totalCost: {
      type: Number,
      required: [true, "Total cost is required"],
      min: [0, "Total cost cannot be negative"],
    },
  },
  {
    /** Automatically add createdAt and updatedAt timestamps */
    timestamps: true,
  }
);

const Reservation = mongoose.model("Reservation", reservationSchema);

export default Reservation;
