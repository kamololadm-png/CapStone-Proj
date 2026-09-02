import "./FutureGetaways.css";
import { useState } from "react";

const tabs = ["Weekend trips", "Getaways", "Unique stays"];

const tabContent = {
  0: [
    "Cabins in the mountains",
    "Beachfront villas",
    "City apartments",
    "Countryside cottages",
  ],
  1: [
    "Wine country retreats",
    "Lake house escapes",
    "Desert oasis stays",
    "Forest hideaways",
  ],
  2: [
    "Treehouses",
    "Converted barns",
    "Houseboats",
    "Historic castles",
  ],
};

const FutureGetaways = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="future-getaways">
      <h2>Inspiration for future getaways</h2>

      <div className="tabs">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            className={activeTab === index ? "tab active" : "tab"}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="tab-content">
        <ul>
          {tabContent[activeTab].map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FutureGetaways;