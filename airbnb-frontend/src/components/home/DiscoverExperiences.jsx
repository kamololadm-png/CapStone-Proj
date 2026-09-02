/**
 * DiscoverExperiences.jsx
 *
 * Home page section with two background-image cards:
 *  1. "Things to do on your trip"   → navigates to /locations/New York
 *  2. "Things to do at home"        → navigates to /locations/Cape Town
 *
 * Both cards use a gradient overlay for text legibility and navigate to a
 * real location search so the buttons are functional.
 */
import "./DiscoverExperiences.css";
import { useNavigate } from "react-router-dom";

const DiscoverExperiences = () => {
  const navigate = useNavigate();

  return (
    <section className="discover-experiences">
      <h2>Discover Airbnb Experiences</h2>

      <div className="experience-cards">

        {/* Card 1 — outdoor / travel experiences */}
        <div
          className="experience-card"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1568454537842-d933259bb258?w=700&auto=format&fit=crop&q=60)",
          }}
        >
          <h3>Things to do on your trip</h3>
          <button
            type="button"
            onClick={() => navigate("/locations/New York")}
            aria-label="Explore experiences in New York"
          >
            Explore experiences
          </button>
        </div>

        {/* Card 2 — at-home / local experiences */}
        <div
          className="experience-card"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1758273238903-b5ca5f9988d1?w=700&auto=format&fit=crop&q=60)",
          }}
        >
          <h3>Things to do at home</h3>
          <button
            type="button"
            onClick={() => navigate("/locations/Cape Town")}
            aria-label="Explore online experiences in Cape Town"
          >
            Explore online experiences
          </button>
        </div>

      </div>
    </section>
  );
};

export default DiscoverExperiences;
