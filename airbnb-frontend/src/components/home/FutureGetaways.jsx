/**
 * FutureGetaways.jsx
 *
 * Home page section: "Inspiration for future getaways".
 *
 * Renders a tabbed interface with three categories of stay types.
 * Clicking a tab swaps the displayed list of stay suggestions.
 *
 * Tabs: Weekend trips | Getaways | Unique stays
 *
 * Content is static for display purposes. In a production app, each item
 * would link to a filtered location search.
 */
import "./FutureGetaways.css";
import { useState } from "react";

/** Tab labels displayed in the tab bar */
const tabs = ["Weekend trips", "Getaways", "Unique stays"];

/**
 * Static content for each tab, keyed by tab index.
 * Each entry is a list of stay type descriptions.
 */
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
  // Index of the currently active tab (0-based)
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="future-getaways">
      <h2>Inspiration for future getaways</h2>

      {/* Tab navigation */}
      <div className="tabs" role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === index}
            className={activeTab === index ? "tab active" : "tab"}
            onClick={() => setActiveTab(index)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content — displays the list for the selected tab */}
      <div className="tab-content" role="tabpanel">
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
