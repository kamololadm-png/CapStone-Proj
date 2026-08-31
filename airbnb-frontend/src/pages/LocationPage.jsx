
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

const LocationPage = () => {
  const { locationName } = useParams();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get("/accommodations");
        const filtered = response.data.filter((listing) =>
          listing.location.toLowerCase().includes(locationName.toLowerCase())
        );
        setListings(filtered);
      } catch (err) {
        setError("Failed to load listings.");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [locationName]);

  if (loading) return <p className="page-container">Loading...</p>;
  if (error) return <p className="page-container error-message">{error}</p>;

  return (
    <div className="page-container">
      <h1>
        {listings.length} accommodations in {locationName}
      </h1>

      {listings.length === 0 ? (
        <p>No accommodations found for this location.</p>
      ) : (
        <div className="location-listings">
          {listings.map((listing) => (
            <Link key={listing._id} to={`/listing/${listing._id}`} className="location-listing-card">
              {listing.images?.[0] && <img src={listing.images[0]} alt={listing.title} />}
              <div className="location-listing-details">
                <h3>{listing.type}</h3>
                <p>{listing.title}</p>
                <p>{listing.amenities?.join(", ")}</p>
                <p>⭐ {listing.rating || "New"} · {listing.reviews || 0} reviews</p>
                <p>R{listing.price} / night</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationPage;