import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_AMMO } from "../services/api/queries";
import { useComparison } from "../context/ComparisonContext";
import styles from "./AmmoList.module.css";

// Mapping API caliber names to user-friendly names
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

const AmmoList = ({ caliber, searchTerm }) => {
  const [showAmmo, setShowAmmo] = useState(false);
  const [expandedAmmo, setExpandedAmmo] = useState(null);
  const [fullStatsAmmo, setFullStatsAmmo] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);
  
  // Get comparison context
  const { addToComparison, comparisonList } = useComparison();

  // Function to toggle basic stats
  const toggleAmmoStats = (ammoId) => {
    setExpandedAmmo(expandedAmmo === ammoId ? null : ammoId);
    setFullStatsAmmo(null); // Reset full stats view when switching ammo
  };

  // Function to toggle full details
  const toggleFullStats = (ammoId) => {
    setFullStatsAmmo(fullStatsAmmo === ammoId ? null : ammoId);
  };

  // Updated color coding functions with fixed thresholds
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

  // Fetch all ammo
  const { loading: ammoLoading, error: ammoError, data: ammoData } = useQuery(GET_ALL_AMMO);

  if (ammoLoading) return <p>Loading...</p>;
  if (ammoError) return <p>Error loading ammo data: {ammoError.message}</p>;
  if (!ammoData || !ammoData.items) return <p>No ammo data received from API.</p>;

  // Filter ammo by caliber
  const filteredAmmo = ammoData.items.filter(
    (ammo) =>
      ammo.properties?.caliber &&
      (caliberMapping[ammo.properties.caliber] === caliber || ammo.properties.caliber === caliber)
  );

  // Apply search filter if searchTerm is provided
  const searchFilteredAmmo = searchTerm 
    ? filteredAmmo.filter(ammo => 
        ammo.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredAmmo;

  // Auto-expand if search matches
  if (searchTerm && searchFilteredAmmo.length > 0 && !showAmmo) {
    setTimeout(() => setShowAmmo(true), 0);
  }

  // If search is active but no matches in this caliber, don't show this caliber
  if (searchTerm && searchFilteredAmmo.length === 0) {
    return null;
  }

  // Sort ammo based on selected filter
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
    <div className={styles.caliberContainer}>
      <div className={styles.caliberHeader} onClick={() => setShowAmmo(!showAmmo)}>
        <h2>{caliber}</h2>
        <img
          src={`/images/${caliber}.png`}
          alt={caliber}
          className={styles.caliberImage}
        />
        <span className={styles.toggleIndicator}>{showAmmo ? '▼' : '►'}</span>
      </div>

      {showAmmo && (
        <div className={styles.ammoContainer}>
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
                <li key={ammo.id} className={styles.ammoItem}>
                  <div className={styles.ammoName} onClick={() => toggleAmmoStats(ammo.id)}>
                    {ammo.name}
                    <span className={styles.toggleIndicator}>{expandedAmmo === ammo.id ? '▼' : '►'}</span>
                  </div>

                  {/* Basic Stats Section */}
                  {expandedAmmo === ammo.id && (
                    <div className={styles.basicStats}>
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
                      
                      {/* Trader Prices Section */}
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

                      {/* Full Stats Section */}
                      {fullStatsAmmo === ammo.id && (
                        <div className={styles.fullStats}>
                          <h4>Complete Ammunition Details</h4>
                          <div className={styles.statsGridFull}>
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








