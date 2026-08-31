import "./FutureGetaways.css";
import { useState } from "react";

const tabs = ["Weekend trips", "Getaways", "Unique stays"];

const listItems = [
  "Cabins in the mountains",
  "Beachfront villas",
  "City apartments",
  "Countryside cottages",
];

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
        {activeTab === 0 && (
          <ul>
            {listItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        )}
        {activeTab !== 0 && <p>Explore {tabs[activeTab]} coming soon.</p>}
      </div>
    </section>
  );
};

export default FutureGetaways;