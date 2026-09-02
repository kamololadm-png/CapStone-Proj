/**
 * Inspiration.jsx
 *
 * Home page section: "Inspiration for your next trip".
 *
 * Renders a horizontal row of location cards. Each card shows a destination
 * photo and name, and navigates to the Location Page for that city when clicked.
 *
 * Locations are defined as a static array. To add or change destinations,
 * update the `locations` array below.
 */
import "./Inspiration.css";
import { Link } from "react-router-dom";

/** Static list of featured destinations shown on the home page */
const locations = [
  {
    name: "New York",
    image:
      "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=700&auto=format&fit=crop&q=60",
  },
  {
    name: "Paris",
    image:
      "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=700&auto=format&fit=crop&q=60",
  },
  {
    name: "Tokyo",
    image:
      "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?w=700&auto=format&fit=crop&q=60",
  },
  {
    name: "Cape Town",
    image:
      "https://plus.unsplash.com/premium_photo-1697730061063-ad499e343f26?w=700&auto=format&fit=crop&q=60",
  },
];

const Inspiration = () => {
  return (
    <section className="inspiration">
      <h2>Inspiration for your next trip</h2>

      <div className="location-cards">
        {locations.map((loc) => (
          /* Each card links to /locations/:name to show listings for that city */
          <Link
            key={loc.name}
            to={`/locations/${loc.name}`}
            className="location-card"
          >
            <img src={loc.image} alt={`Stays in ${loc.name}`} />
            <p>{loc.name}</p>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Inspiration;
