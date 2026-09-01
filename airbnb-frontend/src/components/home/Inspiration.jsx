import "./Inspiration.css";
const locations = [
  { name: "New York", image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&q=80" },
  { name: "Paris", image: "https://images.unsplash.com/photo-1502602898ظف657-3e91760cbb34?w=400&q=80" },
  { name: "Tokyo", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=80" },
  { name: "Cape Town", image: "https://images.unsplash.com/photo-1580060839134-75a50c3f7a37?w=400&q=80" },
];

const Inspiration = () => {
  return (
    <section className="inspiration">
      <h2>Inspiration for your next trip</h2>
      <div className="location-cards">
        {locations.map((loc) => (
          <div key={loc.name} className="location-card">
            <img src={loc.image} alt={loc.name} />
            <p>{loc.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Inspiration;