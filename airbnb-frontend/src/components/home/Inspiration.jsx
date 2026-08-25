const locations = [
  { name: "New York", image: "/images/new-york.jpg" },
  { name: "Paris", image: "/images/paris.jpg" },
  { name: "Tokyo", image: "/images/tokyo.jpg" },
  { name: "Cape Town", image: "/images/cape-town.jpg" },
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