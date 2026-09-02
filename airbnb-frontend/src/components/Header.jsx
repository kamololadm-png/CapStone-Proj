/**
 * Header.jsx  (AirBnb Frontend)
 *
 * Sticky top navigation bar rendered on every page of the guest-facing app.
 *
 * Structure:
 *  ┌─────────┬──────────────────────────┬───────────────────┐
 *  │  Logo   │  Location search form    │  Profile section  │
 *  └─────────┴──────────────────────────┴───────────────────┘
 *
 * Location search:
 *  - Text input + "Search" button
 *  - On submit, navigates to /locations/:query
 *
 * Profile section (logged-out):
 *  - "Log In" link → /login
 *
 * Profile section (logged-in):
 *  - "Hi, {username}" button toggles a dropdown menu
 *  - Dropdown: "View Reservations" | "Log Out"
 */
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  // Auth state and helpers from global context
  const { user, logout } = useAuth();

  // Controls the profile dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Controlled value for the location search input
  const [location, setLocation] = useState("");

  const navigate = useNavigate();

  /**
   * Log the user out, close the dropdown, and navigate to the login page.
   */
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  /**
   * Handle the location search form submission.
   * Navigates to /locations/:query if the input is non-empty.
   */
  const handleLocationSearch = (e) => {
    e.preventDefault();
    if (location.trim()) {
      navigate(`/locations/${location.trim()}`);
    }
  };

  return (
    <header className="header">

      {/* Logo — always links back to home */}
      <Link to="/" className="logo">
        airbnb
      </Link>

      {/* Location search form */}
      <form className="location-filter" onSubmit={handleLocationSearch}>
        <input
          type="text"
          placeholder="Search destinations"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          aria-label="Search destinations"
        />
        <button type="submit">Search</button>
      </form>

      {/* Profile / auth section */}
      <div className="header-right">
        {user ? (
          // Logged-in: show username button + dropdown
          <div className="user-menu">
            <button
              className="profile-icon"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              aria-haspopup="true"
              aria-expanded={dropdownOpen}
            >
              Hi, {user.username}
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="dropdown" role="menu">
                <Link
                  to="/reservations"
                  role="menuitem"
                  onClick={() => setDropdownOpen(false)}
                >
                  View Reservations
                </Link>
                <button role="menuitem" onClick={handleLogout}>
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          // Logged-out: show simple login link
          <Link to="/login" className="login-link">
            Log In
          </Link>
        )}
      </div>

    </header>
  );
};

export default Header;
