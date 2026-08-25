const DiscoverExperiences = () => {
  return (
    <section className="discover-experiences">
      <h2>Discover Airbnb Experiences</h2>
      <div className="experience-cards">
        <div className="experience-card" style={{ backgroundImage: "url(/images/things-to-do-trip.jpg)" }}>
          <h3>Things to do on your trip</h3>
          <button>Explore experiences</button>
        </div>
        <div className="experience-card" style={{ backgroundImage: "url(/images/things-to-do-home.jpg)" }}>
          <h3>Things to do at home</h3>
          <button>Explore online experiences</button>
        </div>
      </div>
    </section>
  );
};

export default DiscoverExperiences;