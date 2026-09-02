import "./HeroBanner.css";
import { useNavigate } from "react-router-dom";

const HeroBanner = () => {
  const navigate = useNavigate();

  return (
    <section className="hero-banner">
      <h1>Not sure where to go? Perfect.</h1>
      <button type="button" onClick={() => navigate("/locations/Cape Town")}>
        Explore Stays Nearby
      </button>
    </section>
  );
};

export default HeroBanner;