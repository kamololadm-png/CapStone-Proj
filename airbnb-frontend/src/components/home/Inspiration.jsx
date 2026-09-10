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
    name: "North West",
    image:
      "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkK6XxZs9yeSTTF7QK2RAUHkPsHV8KNG5x2s90ocfZ_fsdP7mxI1KE0ANLnXYbb0ZVvUOylzIu5aEQasck84er5xmCVbvT2lE9dfL4rOPY8GtV0YNiYkdJ-nBkA7ydtEHrjbcCzDg=s680-w680-h510-rw",
  },
  {
    name: "KwaZulu-Natal",
    image:
      "https://images.unsplash.com/photo-1477901701740-5304fcfcb7fa?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZHVyYmFufGVufDB8fDB8fHww",
  },
  {
    name: "Johannesburg",
    image:
      "https://plus.unsplash.com/premium_photo-1742418150348-371701631845?w=300&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8am9oYW5uZXNidXJnfGVufDB8fDB8fHww",
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
