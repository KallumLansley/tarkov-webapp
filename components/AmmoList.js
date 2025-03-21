//AmmoList.js
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_AMMO } from "../services/api/queries";
import { useComparison } from "../context/ComparisonContext";
import styles from "./AmmoList.module.css";

// This mapping was necessary because the API uses different names than the in-game display
// Took a while to compile all of these from the API documentation and testing
const caliberMapping = {
  "Caliber556x45NATO": "5.56x45mm",
  "Caliber12g": "12 Gauge Shot",
  "Caliber20g": "20 Gauge",
  "Caliber23x75": "23x75mm",
  "Caliber9x18PM": "9x18mm",
  "Caliber762x25TT": "7.62x25mm",
  "Caliber9x19PARA": "9x19mm",
  "Caliber1143x23ACP": "45 ACP",
  "Caliber40x46": "40x46mm", 
  "Caliber545x39": "5.45x39mm",
  "Caliber762x39": "7.62x39mm",
  "Caliber762x51": "7.62x51mm",
  "Caliber762x54R": "7.62x54R",
  "Caliber127x55": "12.7x55mm",
  "Caliber9x39": "9x39mm",
  "Caliber366TKM": "366 TKM",
  "Caliber46x30": "4.6x30mm",
  "Caliber57x28": "5.7x28mm",
  "Caliber9x21": "9x21mm",
  "Caliber68x51": "6.8x51mm",
  "Caliber762x35": "300 BLK",
  "Caliber86x70": "338 Lapua Magnum", 
  "Caliber9x33R": "357 Magnum", 
};

const AmmoList = ({ caliber, searchTerm, isRandomTarget, randomAmmo }) => {
  // State for handling progressive disclosure - each level can be expanded/collapsed
  // Uses the random target props to auto-expand when needed
  const [showAmmo, setShowAmmo] = useState(isRandomTarget ? true : false);
  const [expandedAmmo, setExpandedAmmo] = useState(null);
  const [fullStatsAmmo, setFullStatsAmmo] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedArmorClass, setSelectedArmorClass] = useState(3);
  
  // Add this effect to properly handle random selections
  useEffect(() => {
    // When randomAmmo changes, update expandedAmmo state
    if (randomAmmo) {
      setExpandedAmmo(randomAmmo);
    }
  }, [randomAmmo]);

  // Using the comparison context to share state between components
  // This was the cleanest way I found to implement the comparison feature
  const { addToComparison, comparisonList } = useComparison();

  // Toggle handlers for the different disclosure levels
  // Each one manages its own state independently
  const toggleAmmoStats = (ammoId) => {
    setExpandedAmmo(expandedAmmo === ammoId ? null : ammoId);
    setFullStatsAmmo(null); // Reset full stats when toggling basic stats
  };

  const toggleFullStats = (ammoId) => {
    setFullStatsAmmo(fullStatsAmmo === ammoId ? null : ammoId);
  };

  // These color coding functions help users quickly identify ammo properties
  // After testing different thresholds, these values seemed to work best
  const getDamageClass = (damage) => {
    if (damage >= 51) return styles.highDamage;
    if (damage >= 31) return styles.mediumDamage;
    return styles.lowDamage;
  };

  const getPenetrationClass = (penetration) => {
    if (penetration >= 30) return styles.highPenetration;
    if (penetration >= 21) return styles.mediumPenetration;
    return styles.lowPenetration;
  };

  // This function calculates armor effectiveness ratings based on penetration power
  // I derived these thresholds from the Tarkov Ballistics wiki and in-game testing
  // The values represent how well ammo performs against different armor classes
  const getArmorEffectivenessRating = (pen, armorClass) => {
    // Different armor classes have different penetration thresholds
    // These numbers came from the Tarkov wiki
    const thresholds = {
      1: { high: 25, medium: 15 },
      2: { high: 30, medium: 20 },
      3: { high: 40, medium: 30 },
      4: { high: 45, medium: 35 },
      5: { high: 50, medium: 45 },
      6: { high: 60, medium: 50 }
    };

    const classThresholds = thresholds[armorClass] || { high: 60, medium: 30 };
    if (pen >= classThresholds.high) return { class: styles.highEffectiveness, text: "6", backgroundColor: "#00ff00" }; // Green
    if (pen >= classThresholds.medium) return { class: styles.mediumEffectiveness, text: "5", backgroundColor: "#ffcc00" }; // Yellow
    return { class: styles.lowEffectiveness, text: "0", backgroundColor: "#ff0000" }; // Red
  };

  // These functions calculate additional ballistic properties that aren't directly in the API
  // Had to research how Tarkov's ballistics work to implement these
  const calculateEffectiveRange = (initialSpeed) => {
    if (!initialSpeed) return "N/A";
    // This is a simplified approximation based on testing
    // Real ballistics are more complex, but this gives a useful estimate
    return Math.round(initialSpeed * 0.8);
  };

  const calculateDamageAtRange = (damage, range) => {
    if (!damage) return "N/A";
    // Simple damage drop-off calculation based on game mechanics
    // This is an approximation - actual values might vary in-game
    const dropOffFactor = Math.max(0.7, 1 - (range / 1000));
    return Math.round(damage * dropOffFactor);
  };

  // Fetching data using Apollo Client - took a while to get this working properly
  // The GraphQL query structure was tricky to understand at first
  const { loading: ammoLoading, error: ammoError, data: ammoData } = useQuery(GET_ALL_AMMO);

  // Loading/error states to prevent crashes and show feedback to users
  if (ammoLoading) return <p>Loading...</p>;
  if (ammoError) return <p>Error loading ammo data: {ammoError.message}</p>;
  if (!ammoData || !ammoData.items) return <p>No ammo data received from API.</p>;

  // Filter ammo by caliber - needed to match API's internal naming with display names
  // This was one of the trickier parts of the implementation due to inconsistent naming
  const filteredAmmo = ammoData.items.filter(
    (ammo) =>
      ammo.properties?.caliber &&
      (caliberMapping[ammo.properties.caliber] === caliber || ammo.properties.caliber === caliber)
  );

  // If search term provided, further filter the ammo list
  // Simple case-insensitive includes search - could be improved in future
  const searchFilteredAmmo = searchTerm 
    ? filteredAmmo.filter(ammo => 
        ammo.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredAmmo;

  // Auto-expand if search matches or is random target
  // Uses setTimeout to avoid React state update during render warning
  if ((searchTerm && searchFilteredAmmo.length > 0 && !showAmmo) || isRandomTarget) {
    setTimeout(() => setShowAmmo(true), 0);
  }

  // If searching and no matches for this caliber, don't show it at all
  // This keeps the search results cleaner and focused on matches
  if (searchTerm && searchFilteredAmmo.length === 0) {
    return null;
  }

  // Sorting logic for the ammo list based on user selection
  // Keeping the original order if no sorting selected
  const sortedAmmo = [...searchFilteredAmmo].sort((a, b) => {
    if (!selectedFilter) return 0;
    
    if (selectedFilter === 'damage') {
      return b.properties.damage - a.properties.damage;
    } else if (selectedFilter === 'penetration') {
      return b.properties.penetrationPower - a.properties.penetrationPower;
    }
    return 0;
  });

  return (
    <div className={`${styles.caliberContainer} ${isRandomTarget ? styles.randomTarget : ''}`}>
      {/* Caliber header - always visible, toggles showing ammo list */}
      <div className={styles.caliberHeader} onClick={() => setShowAmmo(!showAmmo)}>
        <h2>{caliber}</h2>
        <img
          src={`/images/${caliber}.png`}
          alt={caliber}
          className={styles.caliberImage}
        />
        <span className={styles.toggleIndicator}>{showAmmo ? '▼' : '►'}</span>
      </div>

      {/* First level of progressive disclosure - ammo list */}
      {showAmmo && (
        <div className={styles.ammoContainer}>
          {/* Sorting controls */}
          <div className={styles.filterControls}>
            <span>Sort by: </span>
            <button 
              className={selectedFilter === 'damage' ? styles.activeFilter : ''}
              onClick={() => setSelectedFilter('damage')}
            >
              Damage
            </button>
            <button 
              className={selectedFilter === 'penetration' ? styles.activeFilter : ''}
              onClick={() => setSelectedFilter('penetration')}
            >
              Penetration
            </button>
            <button 
              className={!selectedFilter ? styles.activeFilter : ''}
              onClick={() => setSelectedFilter(null)}
            >
              Default
            </button>
          </div>
          
          {sortedAmmo.length > 0 ? (
            <ul className={styles.ammoList}>
              {sortedAmmo.map((ammo) => (
                <li 
                  key={ammo.id} 
                  className={`${styles.ammoItem} ${randomAmmo === ammo.id ? styles.highlightedAmmo : ''}`}
                  id={`ammo-${ammo.id}`}
                >
                  {/* Ammo name header - toggles showing basic stats */}
                  <div className={styles.ammoName} onClick={() => toggleAmmoStats(ammo.id)}>
                    {ammo.name}
                    <span className={styles.toggleIndicator}>{expandedAmmo === ammo.id ? '▼' : '►'}</span>
                  </div>

                  {/* Second level of progressive disclosure - basic stats */}
                  {expandedAmmo === ammo.id && (
                    <div className={styles.basicStats}>
                      {/* Key stats grid */}
                      <div className={styles.statsGrid}>
                        <div className={styles.statBox}>
                          <span className={styles.statLabel}>Damage</span>
                          <span className={`${styles.statValue} ${getDamageClass(ammo.properties.damage)}`}>
                            {ammo.properties.damage}
                          </span>
                        </div>
                        <div className={styles.statBox}>
                          <span className={styles.statLabel}>Penetration</span>
                          <span className={`${styles.statValue} ${getPenetrationClass(ammo.properties.penetrationPower)}`}>
                            {ammo.properties.penetrationPower}
                          </span>
                        </div>
                      </div>
                      
                      {/* Armor effectiveness table - provides a visual que to how good an ammo is against certain armor tiers */}
                      <div className={styles.armorEffectiveness}>
                        <div className={styles.armorEffectivenessHeader}>
                          <h4>Armor Class Effectiveness</h4>
                          <div className={styles.infoTooltip}>
                            ?
                            <div className={styles.tooltipContent}>
                              <p>Colour indicates effectiveness against armor:</p>
                              <p><span className={styles.greenDot}></span> High (6) - Penetrates easily</p>
                              <p><span className={styles.yellowDot}></span> Medium (5) - Likely to penetrate</p>
                              <p><span className={styles.redDot}></span> Low (0) - Unlikely to penetrate</p>
                            </div>
                          </div>
                        </div>
                        <div className={styles.armorTable}>
                          <div className={styles.armorTableHeader}>
                            <div className={styles.armorTableHeaderCell}>Class 1</div>
                            <div className={styles.armorTableHeaderCell}>Class 2</div>
                            <div className={styles.armorTableHeaderCell}>Class 3</div>
                            <div className={styles.armorTableHeaderCell}>Class 4</div>
                            <div className={styles.armorTableHeaderCell}>Class 5</div>
                            <div className={styles.armorTableHeaderCell}>Class 6</div>
                          </div>
                          <div className={styles.armorTableRow}>
                            {[1, 2, 3, 4, 5, 6].map(armorClass => {
                              const rating = getArmorEffectivenessRating(ammo.properties.penetrationPower, armorClass);
                              return (
                                <div 
                                  key={armorClass} 
                                  className={styles.armorTableCell}
                                  style={{ backgroundColor: rating.backgroundColor }}
                                >
                                  {rating.text}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      {/* Trader prices - useful for players to know where to buy ammo */}
                      <div className={styles.priceSection}>
                        <h4>Available From:</h4>
                        {ammo.buyFor && ammo.buyFor.length > 0 ? (
                          <ul className={styles.priceList}>
                            {ammo.buyFor.map((price, index) => (
                              <li key={index} className={styles.priceItem}>
                                {price.vendor?.name || price.source}: {price.price} {price.currency}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Not available from traders</p>
                        )}
                      </div>
                      
                      {/* Action buttons for full stats and comparison */}
                      <div className={styles.actions}>
                        <button 
                          className={styles.fullStatsToggle}
                          onClick={() => toggleFullStats(ammo.id)}
                        >
                          {fullStatsAmmo === ammo.id ? "Hide Full Stats" : "View Full Stats"}
                        </button>
                        
                        <button 
                          className={styles.compareButton}
                          onClick={() => addToComparison(ammo)}
                          disabled={comparisonList.find(item => item.id === ammo.id) || comparisonList.length >= 4}
                        >
                          {comparisonList.find(item => item.id === ammo.id) 
                            ? "Added to Compare" 
                            : "Add to Compare"}
                        </button>
                      </div>

                      {/* Third level of progressive disclosure - full detailed stats */}
                      {fullStatsAmmo === ammo.id && (
                        <div className={styles.fullStats}>
                          <h4>Complete Ammunition Details</h4>
                          <div className={styles.statsGridFull}>
                            {/* All the detailed stats - this gets pretty technical and is for the more experienced players */}
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Tracer</span>
                              <span className={styles.statValue}>{ammo.properties.tracer ? "Yes" : "No"}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Tracer Color</span>
                              <span className={styles.statValue}>{ammo.properties.tracerColor || "N/A"}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Damage</span>
                              <span className={`${styles.statValue} ${getDamageClass(ammo.properties.damage)}`}>
                                {ammo.properties.damage}
                              </span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Armor Damage</span>
                              <span className={styles.statValue}>{ammo.properties.armorDamage}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Fragmentation</span>
                              <span className={styles.statValue}>{ammo.properties.fragmentationChance}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Ricochet Chance</span>
                              <span className={styles.statValue}>{ammo.properties.ricochetChance}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Penetration Chance</span>
                              <span className={styles.statValue}>{ammo.properties.penetrationChance}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Accuracy Modifier</span>
                              <span className={styles.statValue}>{ammo.properties.accuracyModifier || "N/A"}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Recoil Modifier</span>
                              <span className={styles.statValue}>{ammo.properties.recoilModifier || "N/A"}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Initial Speed</span>
                              <span className={styles.statValue}>{ammo.properties.initialSpeed || "N/A"}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Light Bleed</span>
                              <span className={styles.statValue}>{ammo.properties.lightBleedModifier}</span>
                            </div>
                            <div className={styles.statBox}>
                              <span className={styles.statLabel}>Heavy Bleed</span>
                              <span className={styles.statValue}>{ammo.properties.heavyBleedModifier}</span>
                            </div>
                          </div>

                          {/* Ballistics section - calculated values based on game mechanics */}
                          <div className={styles.ballisticsSection}>
                            <h4>Ballistics Information</h4>
                            <div className={styles.ballisticsGrid}>
                              <div className={styles.ballisticsItem}>
                                <span className={styles.ballisticsLabel}>Initial Speed</span>
                                <span className={styles.ballisticsValue}>{ammo.properties.initialSpeed} m/s</span>
                              </div>
                              <div className={styles.ballisticsItem}>
                                <span className={styles.ballisticsLabel}>Effective Range</span>
                                <span className={styles.ballisticsValue}>{calculateEffectiveRange(ammo.properties.initialSpeed)} m</span>
                              </div>
                              <div className={styles.ballisticsItem}>
                                <span className={styles.ballisticsLabel}>100m Damage</span>
                                <span className={styles.ballisticsValue}>{calculateDamageAtRange(ammo.properties.damage, 100)}</span>
                              </div>
                              <div className={styles.ballisticsItem}>
                                <span className={styles.ballisticsLabel}>200m Damage</span>
                                <span className={styles.ballisticsValue}>{calculateDamageAtRange(ammo.properties.damage, 200)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p>No ammo found for this caliber.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AmmoList;