import "./Inspiration.css";
const locations = [
  { name: "New York", image: "https://images.unsplash.com/photo-1541336032412-2048a678540d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3JTIweW9ya3xlbnwwfHwwfHx8MA%3D%3D" },
  { name: "Paris", image: "https://plus.unsplash.com/premium_photo-1661919210043-fd847a58522d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGFyaXN8ZW58MHx8MHx8fDA%3D" },
  { name: "Tokyo", image: "https://plus.unsplash.com/premium_photo-1661914240950-b0124f20a5c1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dG9reW98ZW58MHx8MHx8fDA%3D" },
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