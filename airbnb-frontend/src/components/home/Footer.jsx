import "./Footer.css";
const Footer = () => {
  return (
    <footer className="footer">
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
            <li>Diversity & belonging</li>
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

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Airbnb Clone. All rights reserved.</p>
        <div className="footer-socials">
          <span>Facebook</span>
          <span>Twitter</span>
          <span>Instagram</span>
        </div>
        <select defaultValue="en">
          <option value="en">English (US)</option>
          <option value="fr">Français</option>
        </select>
        <select defaultValue="usd">
          <option value="usd">$ USD</option>
          <option value="zar">R ZAR</option>
        </select>
      </div>
    </footer>
  );
};

export default Footer;