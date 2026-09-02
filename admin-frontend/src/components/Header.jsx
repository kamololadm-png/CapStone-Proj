/**
 * Header.jsx  (Admin Frontend)
 *
 * Persistent top navigation bar rendered on every page.
 *
 * Logged-out state:
 *  - Logo  → home
 *  - "Become a host" link → /login
 *
 * Logged-in state:
 *  - Logo  → home
 *  - "Listings" nav link → /
 *  - "Create Listing" nav link → /create
 *  - "Hi, {username}" button → toggles dropdown
 *    Dropdown: "View Reservations" | "Log Out"
 */
import "./Header.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  // Pull current user and logout helper from global auth context
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  /**
   * Log the user out, close the dropdown, and redirect to the login page.
   */
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <header className="header">
      <Link to="/" className="logo">
        airbnb
      </Link>

      <nav className="nav-links">
        <Link to="/">Listings</Link>
        {user && <Link to="/create">Create Listing</Link>}
      </nav>

      <div className="header-right">
        {user ? (
          <div className="user-menu">
            <button
              className="user-greeting"
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
          <Link to="/login" className="become-host">
            Become a host
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;