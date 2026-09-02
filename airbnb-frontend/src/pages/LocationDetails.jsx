/**
 * LocationDetails.jsx
 *
 * Full detail view for a single accommodation listing.
 *
 * Layout:
 *  ┌─────────────────────────────────┐
 *  │  Heading + Subheading           │
 *  │  Image Gallery (1 large + 4)    │
 *  │  ┌──────────────┬─────────────┐ │
 *  │  │ Static info  │ Cost calc   │ │
 *  │  │ sections     │ + Reserve   │ │
 *  │  └──────────────┴─────────────┘ │
 *  │  Footer                         │
 *  └─────────────────────────────────┘
 *
 * Cost Calculator:
 *  - Date pickers with a minimum of today (past dates are disabled)
 *  - Dynamic cost breakdown: price × nights − weekly discount + fees
 *  - Reserve button: redirects to /login if unauthenticated, otherwise
 *    POSTs to /api/reservations
 */

import "./LocationDetails.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/home/Footer";

/**
 * Returns today's date as a string in YYYY-MM-DD format.
 * Used as the `min` attribute for date pickers to prevent past-date selection.
 */
const getTodayString = () => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const TODAY = getTodayString();

const LocationDetails = () => {
  // Listing ID from the route: /listing/:id
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Listing data fetched from the API
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Cost calculator / booking form state
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [booking, setBooking] = useState(false);

  // ---------------------------------------------------------------------------
  // Fetch listing on mount (or when the :id param changes)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/accommodations/${id}`);
        setListing(response.data);
      } catch (err) {
        setError("Failed to load this listing.");
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  // ---------------------------------------------------------------------------
  // Cost calculations — recalculate whenever dates or listing changes
  // ---------------------------------------------------------------------------

  /**
   * Calculate the number of nights between check-in and check-out.
   * Returns 0 if dates are not yet selected or check-out ≤ check-in.
   */
  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil(
      (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)
    );
    return nights > 0 ? nights : 0;
  };

  const nights = getNights();

  // Individual cost line items
  const nightsCost = listing ? nights * listing.price : 0;
  const discountAmount = listing
    ? (nightsCost * (listing.weeklyDiscount || 0)) / 100
    : 0;
  const cleaningFee = listing?.cleaningFee || 0;
  const serviceFee = listing?.serviceFee || 0;
  const occupancyTaxes = listing?.occupancyTaxes || 0;

  // Grand total
  const totalCost =
    nightsCost - discountAmount + cleaningFee + serviceFee + occupancyTaxes;

  // ---------------------------------------------------------------------------
  // Reserve handler
  // ---------------------------------------------------------------------------

  /**
   * Validate the booking form and POST a reservation to the API.
   * Redirects to /login if the user is not authenticated.
   */
  const handleReserve = async () => {
    setBookingError("");
    setBookingSuccess("");

    // Unauthenticated users are sent to the login page
    if (!user) {
      navigate("/login");
      return;
    }

    if (!checkIn || !checkOut || nights <= 0) {
      setBookingError("Please select valid check-in and check-out dates.");
      return;
    }

    setBooking(true);

    try {
      await api.post("/reservations", {
        accommodation: id,
        checkIn,
        checkOut,
        guests: Number(guests),
      });
      setBookingSuccess("Reservation created successfully!");
    } catch (err) {
      setBookingError(
        err.response?.data?.message || "Failed to create reservation."
      );
    } finally {
      setBooking(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------
  if (loading) return <p className="page-container">Loading...</p>;
  if (error) return <p className="page-container error-message">{error}</p>;
  if (!listing) return null;

  return (
    <div className="page-container">

      {/* ── Heading & Subheading ── */}
      <h1>
        {listing.type} in {listing.location}
      </h1>
      <p className="subheading">
        ⭐ {listing.rating} · {listing.reviews} reviews · {listing.location}
      </p>

      {/* ── Image Gallery ── */}
      {/* Layout: one large image on the left, four smaller images (2×2) on the right */}
      <div className="image-gallery">
        <img
          className="main-image"
          src={listing.images?.[0]}
          alt={listing.title}
        />
        <div className="sub-images">
          {(listing.images || []).slice(1, 5).map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`${listing.title} view ${index + 2}`}
            />
          ))}
        </div>
      </div>

      {/* ── Two-column layout ── */}
      <div className="details-layout">

        {/* Left column — static information sections */}
        <div className="details-left">

          {/* Accommodation overview */}
          <section>
            <h2>Accommodation details</h2>
            <p>{listing.description}</p>
            <p>
              {listing.guests} guests · {listing.bedrooms} bedrooms ·{" "}
              {listing.bathrooms} bathrooms
            </p>
          </section>

          {/* Sleeping arrangements */}
          <section>
            <h2>Where you'll sleep</h2>
            <p>{listing.bedrooms} bedroom(s) available for this stay.</p>
          </section>

          {/* Amenities list */}
          <section>
            <h2>What this place offers</h2>
            <ul>
              {(listing.amenities || []).map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </section>

          {/* Stay duration highlight */}
          <section>
            <h2>
              {nights > 0 ? `${nights} night${nights !== 1 ? "s" : ""}` : "7 nights"} in{" "}
              {listing.location}
            </h2>
            <p>
              Enjoy your stay in {listing.location}. Explore local attractions,
              relax in comfort, and experience everything this destination has
              to offer.
            </p>
          </section>

          {/* Reviews summary */}
          <section>
            <h2>Reviews</h2>
            <p>
              ⭐ {listing.rating} · {listing.reviews} reviews
            </p>
          </section>

          {/* Host information */}
          <section>
            <h2>Host Details</h2>
            <p>Hosted by {listing.host?.username}</p>
          </section>

          {/* House rules & policies */}
          <section>
            <h2>House Rules, Health &amp; Safety, Cancellation Policy</h2>
            <p>
              Standard house rules apply. Free cancellation within 48 hours of
              booking.
            </p>
          </section>
        </div>

        {/* Right column — cost calculator (sticky on desktop) */}
        <div className="details-right">
          <div className="cost-calculator">

            {/* Nightly rate */}
            <h2>
              R{listing.price} <span>/ night</span>
            </h2>

            {/* Date pickers — min is today to prevent past-date selection */}
            <div className="date-pickers">
              <label>
                Check-in
                <input
                  type="date"
                  value={checkIn}
                  min={TODAY}
                  onChange={(e) => {
                    setCheckIn(e.target.value);
                    // Reset check-out if it's now before the new check-in date
                    if (checkOut && e.target.value >= checkOut) {
                      setCheckOut("");
                    }
                  }}
                />
              </label>
              <label>
                Check-out
                <input
                  type="date"
                  value={checkOut}
                  /* Check-out must be at least the day after check-in */
                  min={checkIn || TODAY}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </label>
            </div>

            {/* Guest count */}
            <label>
              Guests
              <input
                type="number"
                min="1"
                max={listing.guests}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              />
            </label>

            {/* Dynamic cost breakdown — only shown once dates are selected */}
            {nights > 0 && (
              <div className="cost-breakdown">
                <p>
                  R{listing.price} × {nights} night{nights !== 1 ? "s" : ""}
                  <span>R{nightsCost.toFixed(2)}</span>
                </p>

                {/* Weekly discount row — only shown when a discount applies */}
                {discountAmount > 0 && (
                  <p>
                    Weekly discount
                    <span>−R{discountAmount.toFixed(2)}</span>
                  </p>
                )}

                <p>
                  Cleaning fee <span>R{cleaningFee.toFixed(2)}</span>
                </p>
                <p>
                  Service fee <span>R{serviceFee.toFixed(2)}</span>
                </p>
                <p>
                  Occupancy taxes and fees{" "}
                  <span>R{occupancyTaxes.toFixed(2)}</span>
                </p>
                <hr />
                <p className="total">
                  <strong>
                    Total <span>R{totalCost.toFixed(2)}</span>
                  </strong>
                </p>
              </div>
            )}

            {/* Feedback messages */}
            {bookingError && (
              <p className="error-message">{bookingError}</p>
            )}
            {bookingSuccess && (
              <p className="success-message">{bookingSuccess}</p>
            )}

            {/* Reserve button */}
            <button onClick={handleReserve} disabled={booking}>
              {booking ? "Reserving..." : "Reserve"}
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LocationDetails;
