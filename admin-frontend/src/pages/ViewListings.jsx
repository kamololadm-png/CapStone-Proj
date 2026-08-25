import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ViewListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/accommodations");
      setListings(response.data);
    } catch (err) {
      setError("Failed to load listings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this listing?");
    if (!confirmed) return;

    try {
      await api.delete(`/accommodations/${id}`);
      setListings((prev) => prev.filter((listing) => listing._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete listing.");
    }
  };

  if (loading) return <p className="page-container">Loading listings...</p>;
  if (error) return <p className="page-container error-message">{error}</p>;

  return (
    <div className="page-container">
      <h1>All Listings</h1>

      {listings.length === 0 ? (
        <p>No listings yet. {user && <Link to="/create">Create one</Link>}</p>
      ) : (
        <div className="listings-grid">
          {listings.map((listing) => (
            <div key={listing._id} className="listing-card">
              {listing.images?.[0] && (
                <img src={listing.images[0]} alt={listing.title} />
              )}
              <h3>{listing.title}</h3>
              <p>{listing.location}</p>
              <p>R{listing.price} / night</p>

              {user && (
                <div className="listing-actions">
                  <button onClick={() => navigate(`/update/${listing._id}`)}>
                    Update
                  </button>
                  <button onClick={() => handleDelete(listing._id)}>Delete</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewListings;