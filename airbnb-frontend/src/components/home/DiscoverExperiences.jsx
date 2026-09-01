import "./DiscoverExperiences.css";
const DiscoverExperiences = () => {
  return (
    <section className="discover-experiences">
      <h2>Discover Airbnb Experiences</h2>
      <div className="experience-cards">
        <div className="experience-card" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1568454537842-d933259bb258?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aGlraW5nJTIwYWR2ZW50dXJlJTIwdHJhdmVsfGVufDB8fDB8fHww)" }}>
          <h3>Things to do on your trip</h3>
          <button>Explore experiences</button>
        </div>
        <div className="experience-card" style={{ backgroundImage: "url(https://images.unsplash.com/photo-1758273238903-b5ca5f9988d1?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8dGhpbmdzJTIwdG8lMjBkbyUyMGF0JTIwaG9tZXxlbnwwfHwwfHx8MA%3D%3D)" }}>
          <h3>Things to do at home</h3>
          <button>Explore online experiences</button>
        </div>
      </div>
    </section>
  );
};

export default DiscoverExperiences;