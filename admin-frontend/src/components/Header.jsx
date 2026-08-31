
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

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