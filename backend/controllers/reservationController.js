import Reservation from "../models/Reservation.js";
import Accommodation from "../models/Accommodation.js";

// @route   POST /api/reservations
// @access  Private
export const createReservation = async (req, res) => {
  try {
    const { accommodation, checkIn, checkOut, guests, totalCost } = req.body;

    if (!accommodation || !checkIn || !checkOut || !guests || !totalCost) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const listing = await Accommodation.findById(accommodation);

    if (!listing) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    const reservation = await Reservation.create({
      accommodation,
      user: req.user._id,
      host: listing.host,
      checkIn,
      checkOut,
      guests,
      totalCost,
    });

    res.status(201).json(reservation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/reservations/host
// @access  Private
export const getReservationsByHost = async (req, res) => {
  try {
    const reservations = await Reservation.find({ host: req.user._id })
      .populate("accommodation", "title location price")
      .populate("user", "username email");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/reservations/user
// @access  Private
export const getReservationsByUser = async (req, res) => {
  try {
    const reservations = await Reservation.find({ user: req.user._id })
      .populate("accommodation", "title location price images");

    res.status(200).json(reservations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   DELETE /api/reservations/:id
// @access  Private
export const deleteReservation = async (req, res) => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }

    if (reservation.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this reservation" });
    }

    await reservation.deleteOne();

    res.status(200).json({ message: "Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};