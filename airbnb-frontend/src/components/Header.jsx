import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      navigate(`/locations/${location.trim()}`);
    }
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        airbnb
      </Link>

      <form className="location-filter" onSubmit={handleLocationSearch}>
        <input
          type="text"
          placeholder="Search destinations"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      <div className="header-right">
        {user ? (
          <div className="user-menu">
            <button
              className="profile-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              Hi, {user.username}
            </button>

            {dropdownOpen && (
              <div className="dropdown">
                <Link to="/reservations" onClick={() => setDropdownOpen(false)}>
                  View Reservations
                </Link>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="login-link">
            Log In
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;