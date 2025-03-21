//AmmoComparison.js
import { useState } from "react";
import { useComparison } from "../context/ComparisonContext";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import styles from "./AmmoComparison.module.css";

const AmmoComparison = () => {
  // Get comparison data from context - this was cleaner than running the props through every child component as some did not need it
  const { comparisonList, removeFromComparison, clearComparison } = useComparison();
  // State to track if the comparison panel is minimised
  // Added this feature after realising the panel was taking too much screen space
  const [isMinimized, setIsMinimized] = useState(false);
  
  // These colour functions match the ones in AmmoList for consistency
  // Had to duplicate them here since they're used in both components
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
  
  // Format data for the recharts library
  // Took a while to figure out the right structure recharts expects
  const prepareChartData = () => {
    const chartData = [];
    
    comparisonList.forEach(ammo => {
      chartData.push({
        name: ammo.shortName || ammo.name.substring(0, 10), // Truncate long names
        damage: ammo.properties.damage,
        penetration: ammo.properties.penetrationPower,
      });
    });
    
    return chartData;
  };
  
  // Don't render anything if there's nothing to compare
  // This keeps the UI clean when not using the comparison feature
  if (comparisonList.length === 0) {
    return null;
  }
  
  return (
    <div className={`${styles.comparisonContainer} ${isMinimized ? styles.minimized : ''}`}>
      <div className={styles.comparisonHeader}>
        <div className={styles.headerControls}>
          {/* Minimise/expand button to save screen space */}
          <button 
            className={styles.minimizeButton}
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? '▲ Expand' : '▼ Minimise'}
          </button>
          <h3>Ammo Comparison ({comparisonList.length}/4)</h3>
        </div>
        <button 
          className={styles.clearButton} 
          onClick={clearComparison}
        >
          Clear All
        </button>
      </div>
      
      {/* Only render the content if not minimised */}
      {!isMinimized && (
        <>
          {/* Show chart only when comparing 2+ items */}
          {comparisonList.length >= 2 && (
            <div className={styles.chartContainer}>
              {/* Recharts was tricky to set up but works well for visualising data */}
              <ResponsiveContainer width="100%" height={200}>
                <BarChart 
                  data={prepareChartData()} 
                  margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  {/* Used different colours to make bars distinguishable */}
                  <Bar dataKey="damage" name="Damage" fill="#e74c3c" />
                  <Bar dataKey="penetration" name="Penetration" fill="#3498db" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
          
          {/* Display ammo cards in a responsive grid */}
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
                
                {/* Simplified stats display focusing on the most important values */}
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
                  
                  {/* Only show price if available from traders */}
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
        </>
      )}
    </div>
  );
};

// Helper function to find the best trader price
// This ignores flea market prices which are usually more expensive
// Spent some time figuring out how to handle cases where prices might be missing
function getBestPrice(prices) {
  if (!prices || prices.length === 0) return "N/A";
  
  // Use reduce to find the lowest price
  // Had to add special handling for the flea market
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