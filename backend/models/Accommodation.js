/**
 * Accommodation.js
 *
 * Mongoose model for property listings (accommodations).
 *
 * Relationships:
 *  - host     → User  (the host who owns the listing)
 *  - Reservations reference this model via Reservation.accommodation
 */

import mongoose from "mongoose";

const accommodationSchema = new mongoose.Schema(
  {
    /** Display title of the listing */
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },

    /** Full description of the property */
    description: {
      type: String,
      required: [true, "Description is required"],
    },

    /** Category / type of accommodation (e.g. "Entire apartment", "Private room") */
    type: {
      type: String,
      required: [true, "Type is required"],
    },

    /** City or area where the property is located */
    location: {
      type: String,
      required: [true, "Location is required"],
    },

    /** Array of image URLs for the gallery */
    images: {
      type: [String],
      default: [],
    },

    /** Maximum number of guests the property can accommodate */
    guests: {
      type: Number,
      required: [true, "Guest capacity is required"],
      min: [1, "Must accommodate at least 1 guest"],
    },

    /** Number of bedrooms */
    bedrooms: {
      type: Number,
      required: [true, "Bedroom count is required"],
      min: [0, "Bedroom count cannot be negative"],
    },

    /** Number of bathrooms */
    bathrooms: {
      type: Number,
      required: [true, "Bathroom count is required"],
      min: [0, "Bathroom count cannot be negative"],
    },

    /** List of amenities offered (e.g. ["wifi", "kitchen", "free parking"]) */
    amenities: {
      type: [String],
      default: [],
    },

    /** Nightly rate in the host's currency */
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    /** Percentage discount applied when booking 7+ nights (0–100) */
    weeklyDiscount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    /** One-time cleaning fee added to the total cost */
    cleaningFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    /** Platform service fee added to the total cost */
    serviceFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    /** Local occupancy taxes added to the total cost */
    occupancyTaxes: {
      type: Number,
      default: 0,
      min: 0,
    },

    /** Average guest rating (0–5). Updated externally when a review system is added. */
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },

    /** Total number of reviews. Updated externally when a review system is added. */
    reviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    /** Reference to the User who created and owns this listing */
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Host reference is required"],
    },
  },
  {
    /** Automatically add createdAt and updatedAt timestamps */
    timestamps: true,
  }
);

const Accommodation = mongoose.model("Accommodation", accommodationSchema);

export default Accommodation;
