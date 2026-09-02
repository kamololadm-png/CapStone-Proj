import "./Reservations.css";
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
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Location</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res._id}>
                <td>{res.accommodation?.title}</td>
                <td>{res.accommodation?.location}</td>
                <td>{new Date(res.checkIn).toLocaleDateString()}</td>
                <td>{new Date(res.checkOut).toLocaleDateString()}</td>
                <td>{res.guests}</td>
                <td>R{res.totalCost.toFixed(2)}</td>
                <td>
                  <button type="button" className="cancel-btn" onClick={() => handleCancel(res._id)}>
                    Cancel
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reservations;
