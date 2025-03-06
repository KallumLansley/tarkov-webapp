import { useComparison } from "../context/ComparisonContext";
import styles from "./AmmoComparison.module.css";

const AmmoComparison = () => {
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  
  // Updated color coding functions with fixed thresholds
  const getDamageClass = (damage) => {
    if (damage >= 51) return styles.statHigh;
    if (damage >= 31) return styles.statMedium;
    return styles.statLow;
  };

  const getPenetrationClass = (penetration) => {
    if (penetration >= 30) return styles.statHigh;
    if (penetration >= 21) return styles.statMedium;
    return styles.statLow;
  };
  
  if (comparisonList.length === 0) {
    return null;
  }
  
  return (
    <div className={styles.comparisonContainer}>
      <div className={styles.comparisonHeader}>
        <h3>Ammo Comparison ({comparisonList.length}/4)</h3>
        <button 
          className={styles.clearButton} 
          onClick={clearComparison}
        >
          Clear All
        </button>
      </div>
      
      <div className={styles.comparisonGrid}>
        {comparisonList.map(ammo => (
          <div key={ammo.id} className={styles.comparisonCard}>
            <div className={styles.comparisonCardHeader}>
              <h4>{ammo.name}</h4>
              <button 
                className={styles.removeButton}
                onClick={() => removeFromComparison(ammo.id)}
              >
                ✕
              </button>
            </div>
            
            <div className={styles.comparisonStats}>
              <div className={styles.statRow}>
                <div className={styles.statLabel}>Damage</div>
                <div 
                  className={`${styles.statValue} ${getDamageClass(ammo.properties.damage)}`}
                >
                  {ammo.properties.damage}
                </div>
              </div>
              
              <div className={styles.statRow}>
                <div className={styles.statLabel}>Penetration</div>
                <div 
                  className={`${styles.statValue} ${getPenetrationClass(ammo.properties.penetrationPower)}`}
                >
                  {ammo.properties.penetrationPower}
                </div>
              </div>
              
              <div className={styles.statRow}>
                <div className={styles.statLabel}>Armor Damage</div>
                <div className={styles.statValue}>{ammo.properties.armorDamage}</div>
              </div>
              
              <div className={styles.statRow}>
                <div className={styles.statLabel}>Fragmentation</div>
                <div className={styles.statValue}>{ammo.properties.fragmentationChance}</div>
              </div>
              
              <div className={styles.statRow}>
                <div className={styles.statLabel}>Initial Speed</div>
                <div className={styles.statValue}>{ammo.properties.initialSpeed || "N/A"}</div>
              </div>
              
              {ammo.buyFor && ammo.buyFor.length > 0 ? (
                <div className={styles.priceInfo}>
                  <div className={styles.priceLabel}>Best Price:</div>
                  <div className={styles.priceValue}>
                    {getBestPrice(ammo.buyFor)}
                  </div>
                </div>
              ) : (
                <div className={styles.priceInfo}>Not available from traders</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper function for best price calculation
function getBestPrice(prices) {
  if (!prices || prices.length === 0) return "N/A";
  
  // Find the lowest price
  const lowestPrice = prices.reduce((lowest, current) => {
    // Skip Flea Market for best trader price
    if (current.vendor?.name === "Flea Market") return lowest;
    
    if (!lowest || current.price < lowest.price) {
      return current;
    }
    return lowest;
  }, null);
  
  if (lowestPrice) {
    return `${lowestPrice.vendor?.name || lowestPrice.source}: ${lowestPrice.price} ${lowestPrice.currency}`;
  }
  
  return "N/A";
}

export default AmmoComparison;