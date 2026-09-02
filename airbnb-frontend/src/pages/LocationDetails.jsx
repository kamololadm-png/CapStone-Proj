import "./LocationDetails.css";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Footer from "../components/home/Footer";

const LocationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [bookingError, setBookingError] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [booking, setBooking] = useState(false);

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

  // Calculate number of nights between check-in and check-out
  const getNights = () => {
    if (!checkIn || !checkOut) return 0;
    const inDate = new Date(checkIn);
    const outDate = new Date(checkOut);
    const diffTime = outDate - inDate;
    const nights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 0;
  };

  const nights = getNights();

  // Cost breakdown
  const nightsCost = listing ? nights * listing.price : 0;
  const discountAmount = listing
    ? (nightsCost * (listing.weeklyDiscount || 0)) / 100
    : 0;
  const cleaningFee = listing?.cleaningFee || 0;
  const serviceFee = listing?.serviceFee || 0;
  const occupancyTaxes = listing?.occupancyTaxes || 0;
  const totalCost = nightsCost - discountAmount + cleaningFee + serviceFee + occupancyTaxes;

  const handleReserve = async () => {
    setBookingError("");
    setBookingSuccess("");

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
      setBookingError(err.response?.data?.message || "Failed to create reservation.");
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <p className="page-container">Loading...</p>;
  if (error) return <p className="page-container error-message">{error}</p>;
  if (!listing) return null;

  return (
    <div className="page-container">
      {/* Heading and Subheading */}
      <h1>{listing.type} in {listing.location}</h1>
      <p className="subheading">
        ⭐ {listing.rating} · {listing.reviews} reviews · {listing.location}
      </p>

      {/* Image Gallery */}
      <div className="image-gallery">
        <img className="main-image" src={listing.images?.[0]} alt={listing.title} />
        <div className="sub-images">
          {(listing.images || []).slice(1, 5).map((img, index) => (
            <img key={index} src={img} alt={`${listing.title} ${index + 2}`} />
          ))}
        </div>
      </div>

      <div className="details-layout">
        {/* Left column: static info sections */}
        <div className="details-left">
          <section>
            <h2>Accommodation details</h2>
            <p>{listing.description}</p>
            <p>{listing.guests} guests · {listing.bedrooms} bedrooms · {listing.bathrooms} bathrooms</p>
          </section>

          <section>
            <h2>Where you'll sleep</h2>
            <p>{listing.bedrooms} bedroom(s) available for this stay.</p>
          </section>

          <section>
            <h2>What this place offers</h2>
            <ul>
              {(listing.amenities || []).map((amenity) => (
                <li key={amenity}>{amenity}</li>
              ))}
            </ul>
          </section>

          <section>
            <h2>7 nights in {listing.location}</h2>
            <p>
              Enjoy a week-long stay in {listing.location}. Explore local attractions, relax in
              comfort, and experience everything this destination has to offer.
            </p>
          </section>

          <section>
            <h2>Reviews</h2>
            <p>⭐ {listing.rating} · {listing.reviews} reviews</p>
          </section>

          <section>
            <h2>Host Details</h2>
            <p>Hosted by {listing.host?.username}</p>
          </section>

          <section>
            <h2>House Rules, Health & Safety, Cancellation Policy</h2>
            <p>Standard house rules apply. Free cancellation within 48 hours of booking.</p>
          </section>
        </div>

        {/* Right column: cost calculator */}
        <div className="details-right">
          <div className="cost-calculator">
            <h2>R{listing.price} <span>/ night</span></h2>

            <div className="date-pickers">
              <label>
                Check-in
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} />
              </label>
              <label>
                Check-out
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} />
              </label>
            </div>

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

            {nights > 0 && (
              <div className="cost-breakdown">
                <p>R{listing.price} x {nights} nights <span>R{nightsCost.toFixed(2)}</span></p>
                {discountAmount > 0 && (
                  <p>Weekly discount <span>-R{discountAmount.toFixed(2)}</span></p>
                )}
                <p>Cleaning fee <span>R{cleaningFee.toFixed(2)}</span></p>
                <p>Service fee <span>R{serviceFee.toFixed(2)}</span></p>
                <p>Occupancy taxes and fees <span>R{occupancyTaxes.toFixed(2)}</span></p>
                <hr />
                <p className="total"><strong>Total <span>R{totalCost.toFixed(2)}</span></strong></p>
              </div>
            )}

            {bookingError && <p className="error-message">{bookingError}</p>}
            {bookingSuccess && <p className="success-message">{bookingSuccess}</p>}

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