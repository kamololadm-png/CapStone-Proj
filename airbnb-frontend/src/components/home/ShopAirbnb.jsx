/**
 * ShopAirbnb.jsx
 *
 * Home page section promoting Airbnb gift cards.
 *
 * Layout: two-column row — text + CTA button on the left, gift card image on
 * the right. The "Shop Airbnb gift cards" button navigates to the locations
 * page so users can start browsing stays to gift.
 */
import "./ShopAirbnb.css";
import { useNavigate } from "react-router-dom";

const ShopAirbnb = () => {
  const navigate = useNavigate();

  return (
    <section className="shop-airbnb">

      {/* Left column — headline and CTA */}
      <div className="shop-airbnb-text">
        <h2>Give the gift of travel</h2>
        <button
          type="button"
          onClick={() => navigate("/locations/Paris")}
          aria-label="Shop Airbnb gift cards — browse stays in Paris"
        >
          Shop Airbnb gift cards
        </button>
      </div>

      {/* Right column — decorative gift card image */}
      <div className="shop-airbnb-image">
        <img
          src="https://plus.unsplash.com/premium_photo-1728897798011-3de899171c76?w=700&auto=format&fit=crop&q=60"
          alt="Airbnb gift cards"
        />
      </div>

    </section>
  );
};

export default ShopAirbnb;
