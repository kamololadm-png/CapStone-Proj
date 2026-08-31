import { useState, useEffect } from "react";
import api from "../api/axios";

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await api.get("/reservations/user");
        setReservations(response.data);
      } catch (err) {
        setError("Failed to load your reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleCancel = async (id) => {
    const confirmed = window.confirm("Cancel this reservation?");
    if (!confirmed) return;

    try {
      await api.delete(`/reservations/${id}`);
      setReservations((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel reservation.");
    }
  };

  if (loading) return <p className="page-container">Loading your reservations...</p>;
  if (error) return <p className="page-container error-message">{error}</p>;

  return (
    <div className="page-container">
      <h1>My Reservations</h1>

      {reservations.length === 0 ? (
        <p>You have no reservations yet.</p>
      ) : (
        <div className="reservations-list">
          {reservations.map((res) => (
            <div key={res._id} className="reservation-card">
              {res.accommodation?.images?.[0] && (
                <img src={res.accommodation.images[0]} alt={res.accommodation.title} />
              )}
              <div className="reservation-details">
                <h3>{res.accommodation?.title}</h3>
                <p>{res.accommodation?.location}</p>
                <p>
                  {new Date(res.checkIn).toLocaleDateString()} — {new Date(res.checkOut).toLocaleDateString()}
                </p>
                <p>{res.guests} guests</p>
                <p className="reservation-total">R{res.totalCost.toFixed(2)} total</p>
              </div>
              <button onClick={() => handleCancel(res._id)}>Cancel</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reservations;