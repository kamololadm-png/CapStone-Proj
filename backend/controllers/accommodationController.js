import Accommodation from "../models/Accommodation.js";

// @route   POST /api/accommodations
// @access  Private (host only)
export const createAccommodation = async (req, res) => {
  try {
    const {
      title,
      description,
      type,
      location,
      images,
      guests,
      bedrooms,
      bathrooms,
      amenities,
      price,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
    } = req.body;

    if (!title || !description || !type || !location || !guests || !bedrooms || !bathrooms || !price) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const accommodation = await Accommodation.create({
      title,
      description,
      type,
      location,
      images,
      guests,
      bedrooms,
      bathrooms,
      amenities,
      price,
      weeklyDiscount,
      cleaningFee,
      serviceFee,
      occupancyTaxes,
      host: req.user._id,
    });

    res.status(201).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/accommodations
// @access  Public
export const getAccommodations = async (req, res) => {
  try {
    const accommodations = await Accommodation.find().populate("host", "username email");
    res.status(200).json(accommodations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   GET /api/accommodations/:id
// @access  Public
export const getAccommodationById = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate("host", "username email");

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    res.status(200).json(accommodation);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   PUT /api/accommodations/:id
// @access  Private (host only, must own the listing)
export const updateAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    if (accommodation.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    const updated = await Accommodation.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @route   DELETE /api/accommodations/:id
// @access  Private (host only, must own the listing)
export const deleteAccommodation = async (req, res) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    if (accommodation.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await accommodation.deleteOne();

    res.status(200).json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};