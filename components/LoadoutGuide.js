// components/LoadoutGuide.js
import { useState } from "react";
import styles from "./LoadoutGuide.module.css";

const LoadoutGuide = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={`${styles.guidePanel} ${isExpanded ? '' : styles.collapsed}`}>
      {isExpanded ? (
        <>
          <div className={styles.guideHeader}>
            <h2>How to Use the Loadout Builder</h2>
            <button 
              className={styles.closeButton} 
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>
          <div className={styles.guideContent}>
            <p>This interactive tool helps you build a complete Tarkov loadout based on your trader levels. Here's how to use it:</p>
            <ul>
              <li>Set your trader levels in the profile section to see what gear is available to you</li>
              <li>Click on any gear category (Weapons, Helmets, etc.) to expand available options</li>
              <li>Use the search and sort features to find specific items</li>
              <li>Click on an item's name to see detailed stats</li>
              <li>Click "Select" to add the item to your loadout</li>
              <li>The total cost of your loadout is calculated at the bottom</li>
              <li>Items only available through barter trades are also shown</li>
            </ul>
          </div>
        </>
      ) : (
        <button 
          className={styles.expandButton}
          onClick={() => setIsExpanded(true)}
        >
          Show Guide
        </button>
      )}
    </div>
  );
};

export default LoadoutGuide;