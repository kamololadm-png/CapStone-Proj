/**
 * Footer.jsx
 *
 * Site-wide footer rendered at the bottom of every page.
 *
 * Structure:
 *  - Four-column link grid: Support | Community | Hosting | Airbnb
 *  - Bottom bar: copyright · social links · language selector · currency selector
 *
 * Links and social buttons are static for this clone. Language and currency
 * selectors are rendered but do not change application state.
 */
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">

      {/* ── Four-column link grid ── */}
      <div className="footer-links">

        <div className="footer-column">
          <h4>Support</h4>
          <ul>
            <li>Help Center</li>
            <li>Safety information</li>
            <li>Cancellation options</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Community</h4>
          <ul>
            <li>Airbnb.org</li>
            <li>Diversity &amp; belonging</li>
            <li>Accessibility</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Hosting</h4>
          <ul>
            <li>Try hosting</li>
            <li>Protection for hosts</li>
            <li>Explore hosting resources</li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Airbnb</h4>
          <ul>
            <li>Newsroom</li>
            <li>New features</li>
            <li>Careers</li>
          </ul>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div className="footer-bottom">
        {/* Copyright — year is generated dynamically so it never goes stale */}
        <p>&copy; {new Date().getFullYear()} Airbnb Clone. All rights reserved.</p>

        {/* Social media links (static) */}
        <div className="footer-socials">
          <span>Facebook</span>
          <span>Twitter</span>
          <span>Instagram</span>
        </div>

        {/* Language selector */}
        <select defaultValue="en" aria-label="Select language">
          <option value="en">English (US)</option>
          <option value="fr">Français</option>
        </select>

        {/* Currency selector */}
        <select defaultValue="usd" aria-label="Select currency">
          <option value="usd">$ USD</option>
          <option value="zar">R ZAR</option>
        </select>
      </div>

    </footer>
  );
};

export default Footer;
