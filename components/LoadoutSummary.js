// components/LoadoutSummary.js
import { useState } from "react";
import { useLoadout } from "../context/LoadoutContext";
import styles from "./LoadoutSummary.module.css";

const LoadoutSummary = () => {
  const { selectedLoadout, calculateTotalCost } = useLoadout();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Calculate total weight
  const calculateTotalWeight = () => {
    return Object.values(selectedLoadout)
      .filter(item => item !== null)
      .reduce((total, item) => total + (item.weight || 0), 0)
      .toFixed(2);
  };
  
  // Count non-null items
  const selectedItemCount = Object.values(selectedLoadout)
    .filter(item => item !== null)
    .length;
  
	const categoryLabels = {
	  weapon: "Primary Weapon",
	  helmet: "Helmet",
	  headphones: "Headphones", // Add this line
	  armor: "Body Armor",
	  rig: "Tactical Rig",
	  backpack: "Backpack"
	};
  
  return (
    <div className={styles.summaryContainer}>
      <div 
        className={styles.summaryHeader}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2>Loadout Summary</h2>
        <div className={styles.summaryMeta}>
          <span>{selectedItemCount} items selected</span>
          <span className={styles.toggleIndicator}>{isExpanded ? '▼' : '►'}</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className={styles.summaryContent}>
          <div className={styles.summaryStats}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Cost</span>
              <span className={styles.statValue}>{calculateTotalCost().toLocaleString()} ₽</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Total Weight</span>
              <span className={styles.statValue}>{calculateTotalWeight()} kg</span>
            </div>
          </div>
          
          <div className={styles.selectedItems}>
            {Object.entries(selectedLoadout).map(([category, item]) => (
              <div key={category} className={styles.categoryItem}>
                <span className={styles.categoryLabel}>{categoryLabels[category]}</span>
                {item ? (
                  <div className={styles.selectedItemInfo}>
                    {item.baseImageLink && (
                      <img 
                        src={item.baseImageLink} 
                        alt={item.name} 
                        className={styles.itemThumbnail} 
                      />
                    )}
                    <span className={styles.itemName}>{item.name}</span>
                  </div>
                ) : (
                  <span className={styles.emptySlot}>Not selected</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoadoutSummary;