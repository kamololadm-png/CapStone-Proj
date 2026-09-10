/**
 * HeroBanner.jsx
 *
 * Full-width hero section at the top of the Home page.
 *
 * Contains a headline and a single call-to-action button that navigates the
 * user directly to the Cape Town listings page as a default destination.
 * The background image is applied via CSS (HeroBanner.css).
 */
import "./HeroBanner.css";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <h1>Not sure where to go? Perfect.</h1>

      {/* CTA: navigate to a default location search */}
      <button
        type="button"
        onClick={() => navigate("/locations/Cape Town")}
        aria-label="Explore stays nearby in Cape Town"
      >
        Explore Stays Nearby
      </button>
    </section>
  );
};

export default HeroBanner;
