import HeroBanner from "../components/home/HeroBanner";
import Inspiration from "../components/home/Inspiration";
import DiscoverExperiences from "../components/home/DiscoverExperiences";
import ShopAirbnb from "../components/home/ShopAirbnb";
import FutureGetaways from "../components/home/FutureGetaways";
import Footer from "../components/home/Footer";

const Home = () => {
  return (
    <div className="home-page">
      <HeroBanner />
      <Inspiration />
      <DiscoverExperiences />
      <ShopAirbnb />
      <FutureGetaways />
      <Footer />
    </div>
  );
};

export default Home;