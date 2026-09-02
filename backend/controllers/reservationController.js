/**
 * reservationController.js
 *
 * Handles creation and management of accommodation reservations.
 *
 * Routes:
 *  POST   /api/reservations        – Create a reservation (authenticated users)
 *  GET    /api/reservations/host   – Get all reservations for the logged-in host's listings
 *  GET    /api/reservations/user   – Get all reservations made by the logged-in user
 *  DELETE /api/reservations/:id    – Cancel a reservation (reservation owner only)
 */

import Reservation from "../models/Reservation.js";
import Accommodation from "../models/Accommodation.js";

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------

/**
 * Calculate the total cost of a reservation.
 *
 * Formula:
 *  totalCost = (nights × pricePerNight)
 *            − weeklyDiscount%
 *            + cleaningFee
 *            + serviceFee
 *            + occupancyTaxes
 *
 * @param   {object} listing   The Accommodation Mongoose document
 * @param   {string} checkIn   ISO date string for check-in
 * @param   {string} checkOut  ISO date string for check-out
 * @returns {number}           Total cost in the listing's currency
 */
const calculateTotalCost = (listing, checkIn, checkOut) => {
  const nights = Math.ceil(
    (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
  );

  const nightsCost = nights * listing.price;
  const discountAmount = (nightsCost * (listing.weeklyDiscount || 0)) / 100;

  return (
    nightsCost -
    discountAmount +
    (listing.cleaningFee || 0) +
    (listing.serviceFee || 0) +
    (listing.occupancyTaxes || 0)
  );
};

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------

/**
 * @route   POST /api/reservations
 * @access  Private
 * @desc    Create a new reservation for an accommodation. The total cost is
 *          calculated server-side to prevent manipulation from the client.
 *
 * @body  {string} accommodation  MongoDB ObjectId of the Accommodation
 * @body  {string} checkIn        ISO date string (e.g. "2024-08-01")
 * @body  {string} checkOut       ISO date string (e.g. "2024-08-08")
 * @body  {number} guests         Number of guests
 *
 * @returns {201} The newly created Reservation document
 * @returns {400} If required fields are missing, dates are invalid, or guest
 *                count exceeds the listing's maximum
 * @returns {404} If the accommodation does not exist
 */
export const createReservation = async (req, res, next) => {
  try {
    const { accommodation, checkIn, checkOut, guests } = req.body;

    // Ensure all required booking fields are present
    if (!accommodation || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Guard against invalid date strings (e.g. "not-a-date")
    if (Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())) {
      return res.status(400).json({ message: "Invalid check-in or check-out date" });
    }

    // Check-out must be strictly after check-in
    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "Check-out must be after check-in" });
    }

    // Look up the listing to validate guest count and calculate cost
    const listing = await Accommodation.findById(accommodation);
    if (!listing) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    // Validate the guest count is within the listing's stated capacity
    if (Number(guests) < 1 || Number(guests) > listing.guests) {
      return res
        .status(400)
        .json({ message: `Guest count must be between 1 and ${listing.guests}` });
    }

    // Calculate cost server-side so the client cannot manipulate the price
    const totalCost = calculateTotalCost(listing, checkIn, checkOut);

    const reservation = await Reservation.create({
      accommodation,
      user: req.user._id,
      host: listing.host,   // Copy the host reference for quick host-side queries
      checkIn,
      checkOut,
      guests,
      totalCost,
    });

    res.status(201).json(reservation);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// READ — by host
// ---------------------------------------------------------------------------

/**
 * @route   GET /api/reservations/host
 * @access  Private
 * @desc    Return all reservations made on the currently authenticated host's
 *          accommodation listings. Includes guest and property details.
 *
 * @returns {200} Array of Reservation documents
 */
export const getReservationsByHost = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate("accommodation", "title location price")
      .populate("user", "username email")
      .sort({ checkIn: 1 }); // Sort by upcoming check-in date

    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// READ — by user (guest)
// ---------------------------------------------------------------------------

/**
 * @route   GET /api/reservations/user
 * @access  Private
 * @desc    Return all reservations made by the currently authenticated user.
 *          Includes accommodation details so the guest can see what they booked.
 *
 * @returns {200} Array of Reservation documents
 */
export const getReservationsByUser = async (req, res, next) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("accommodation", "title location price images")
      .sort({ checkIn: 1 }); // Sort by upcoming check-in date

    res.status(200).json(reservations);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// DELETE (cancel)
// ---------------------------------------------------------------------------

/**
 * @route   DELETE /api/reservations/:id
 * @access  Private
 * @desc    Cancel (permanently delete) a reservation. Only the guest who made
 *          the reservation is permitted to cancel it.
 *
 * @param   {string} id  MongoDB ObjectId of the Reservation
 *
 * @returns {200} Confirmation message
 * @returns {403} If the authenticated user did not create the reservation
 * @returns {404} If no reservation with the given ID exists
 */
export const deleteReservation = async (req, res, next) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    // Only the guest who made the reservation may cancel it
    if (reservation.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this reservation" });
    }

    await reservation.deleteOne();

    res.status(200).json({ message: "Reservation cancelled successfully" });
  } catch (error) {
    next(error);
  }
};
