/**
 * Reservations.jsx  (Admin Frontend)
 *
 * Displays all reservations made on the currently logged-in host's listings.
 * Data is fetched from GET /api/reservations/host which returns only
 * reservations where the host field matches the authenticated user's ID.
 *
 * Columns: Guest · Property · Check-in · Check-out · Guests · Total
 */
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
        const response = await api.get("/reservations/host");
        setReservations(response.data);
      } catch (err) {
        setError("Failed to load reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  if (loading) return <p className="page-container">Loading reservations...</p>;
  if (error) return <p className="page-container error-message">{error}</p>;

  return (
    <div className="page-container">
      <h1>My Reservations</h1>

      {reservations.length === 0 ? (
        <p>No reservations on your listings yet.</p>
      ) : (
        <table className="reservations-table">
          <thead>
            <tr>
              <th>Guest</th>
              <th>Property</th>
              <th>Check-in</th>
              <th>Check-out</th>
              <th>Guests</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res._id}>
                <td>{res.user?.username}</td>
                <td>{res.accommodation?.title}</td>
                <td>{new Date(res.checkIn).toLocaleDateString()}</td>
                <td>{new Date(res.checkOut).toLocaleDateString()}</td>
                <td>{res.guests}</td>
                <td>R{res.totalCost.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reservations;