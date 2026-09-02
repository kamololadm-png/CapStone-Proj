/**
 * accommodationController.js
 *
 * Handles all CRUD operations for accommodation listings.
 *
 * Routes:
 *  POST   /api/accommodations        – Create a new listing (host only)
 *  GET    /api/accommodations        – List all listings with optional filters + pagination
 *  GET    /api/accommodations/:id    – Get a single listing by ID
 *  PUT    /api/accommodations/:id    – Update a listing (owner only)
 *  DELETE /api/accommodations/:id    – Delete a listing (owner only)
 */

import Accommodation from "../models/Accommodation.js";

// ---------------------------------------------------------------------------
// CREATE
// ---------------------------------------------------------------------------

/**
 * @route   POST /api/accommodations
 * @access  Private – host role required
 * @desc    Create a new property listing. The authenticated user becomes the host.
 *
 * @body  {string}   title
 * @body  {string}   description
 * @body  {string}   type          e.g. "Entire apartment"
 * @body  {string}   location
 * @body  {number}   guests
 * @body  {number}   bedrooms
 * @body  {number}   bathrooms
 * @body  {number}   price         Price per night
 * @body  {string[]} [images]      Array of image URLs
 * @body  {string[]} [amenities]   Array of amenity strings
 * @body  {number}   [weeklyDiscount]
 * @body  {number}   [cleaningFee]
 * @body  {number}   [serviceFee]
 * @body  {number}   [occupancyTaxes]
 *
 * @returns {201} The newly created Accommodation document
 * @returns {400} If any required field is missing
 */
export const createAccommodation = async (req, res, next) => {
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

    // Validate all required fields are present
    if (!title || !description || !type || !location || !guests || !bedrooms || !bathrooms || !price) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const accommodation = await Accommodation.create({
      title,
      description,
      type,
      location,
      images: images || [],
      guests,
      bedrooms,
      bathrooms,
      amenities: amenities || [],
      price,
      weeklyDiscount: weeklyDiscount || 0,
      cleaningFee: cleaningFee || 0,
      serviceFee: serviceFee || 0,
      occupancyTaxes: occupancyTaxes || 0,
      host: req.user._id,
    });

    res.status(201).json(accommodation);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// READ ALL (with filtering & pagination)
// ---------------------------------------------------------------------------

/**
 * @route   GET /api/accommodations
 * @access  Public
 * @desc    Return a paginated, filterable list of all accommodation listings.
 *
 * @query  {string}  [location]   Filter by location (case-insensitive partial match)
 * @query  {string}  [type]       Filter by accommodation type (case-insensitive partial match)
 * @query  {number}  [minPrice]   Minimum price per night
 * @query  {number}  [maxPrice]   Maximum price per night
 * @query  {number}  [page=1]     Page number (1-based)
 * @query  {number}  [limit=12]   Results per page (max 50)
 *
 * @returns {200} { accommodations, page, totalPages, total }
 */
export const getAccommodations = async (req, res, next) => {
  try {
    const { location, type, minPrice, maxPrice, page = 1, limit = 12 } = req.query;

    // Build a dynamic Mongoose filter object from the query params
    const filter = {};

    if (location) {
      // Case-insensitive partial match on the location field
      filter.location = { $regex: location, $options: "i" };
    }

    if (type) {
      // Case-insensitive partial match on accommodation type
      filter.type = { $regex: type, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    // Cap the page size at 50 to prevent overly large responses
    const pageSize = Math.min(Number(limit), 50);
    const pageNumber = Math.max(Number(page), 1);
    const skip = (pageNumber - 1) * pageSize;

    // Run count and data fetch in parallel for efficiency
    const [total, accommodations] = await Promise.all([
      Accommodation.countDocuments(filter),
      Accommodation.find(filter)
        .populate("host", "username email")
        .sort({ createdAt: -1 })   // Newest first
        .skip(skip)
        .limit(pageSize),
    ]);

    res.status(200).json({
      accommodations,
      page: pageNumber,
      totalPages: Math.ceil(total / pageSize),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// READ ONE
// ---------------------------------------------------------------------------

/**
 * @route   GET /api/accommodations/:id
 * @access  Public
 * @desc    Return a single accommodation listing by its MongoDB ID.
 *
 * @param   {string} id  The MongoDB ObjectId of the listing
 *
 * @returns {200} The Accommodation document with populated host details
 * @returns {404} If no listing with the given ID exists
 */
export const getAccommodationById = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id).populate(
      "host",
      "username email"
    );

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    res.status(200).json(accommodation);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// UPDATE
// ---------------------------------------------------------------------------

/**
 * @route   PUT /api/accommodations/:id
 * @access  Private – host role + must own the listing
 * @desc    Update an existing accommodation listing. Only the host who created
 *          the listing is permitted to update it.
 *
 * @param   {string} id  The MongoDB ObjectId of the listing
 * @body    Any subset of the Accommodation schema fields
 *
 * @returns {200} The updated Accommodation document
 * @returns {403} If the authenticated user is not the listing owner
 * @returns {404} If no listing with the given ID exists
 */
export const updateAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    // Ownership check — only the original host may update
    if (accommodation.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this listing" });
    }

    const updated = await Accommodation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }  // Return the updated doc and run schema validators
    );

    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------

/**
 * @route   DELETE /api/accommodations/:id
 * @access  Private – host role + must own the listing
 * @desc    Permanently delete an accommodation listing. Only the host who
 *          created the listing is permitted to delete it.
 *
 * @param   {string} id  The MongoDB ObjectId of the listing
 *
 * @returns {200} Confirmation message
 * @returns {403} If the authenticated user is not the listing owner
 * @returns {404} If no listing with the given ID exists
 */
export const deleteAccommodation = async (req, res, next) => {
  try {
    const accommodation = await Accommodation.findById(req.params.id);

    if (!accommodation) {
      return res.status(404).json({ message: "Accommodation not found" });
    }

    // Ownership check — only the original host may delete
    if (accommodation.host.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this listing" });
    }

    await accommodation.deleteOne();

    res.status(200).json({ message: "Accommodation deleted successfully" });
  } catch (error) {
    next(error);
  }
};
