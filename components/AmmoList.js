import { useState } from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_AMMO } from "../services/api/queries";
import styles from "./AmmoList.module.css";  // Import the CSS module

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

const AmmoList = ({ caliber }) => {
  // Your existing state hooks
  const [showAmmo, setShowAmmo] = useState(false);
  const [expandedAmmo, setExpandedAmmo] = useState(null);
  const [fullStatsAmmo, setFullStatsAmmo] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(null);

  // Function to toggle basic stats
  const toggleAmmoStats = (ammoId) => {
    setExpandedAmmo(expandedAmmo === ammoId ? null : ammoId);
    setFullStatsAmmo(null); // Reset full stats view when switching ammo
  };

  // Function to toggle full details
  const toggleFullStats = (ammoId) => {
    setFullStatsAmmo(fullStatsAmmo === ammoId ? null : ammoId);
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

  // Sort ammo based on selected filter
  const sortedAmmo = [...filteredAmmo].sort((a, b) => {
    if (!selectedFilter) return 0;
    
    if (selectedFilter === 'damage') {
      return b.properties.damage - a.properties.damage;
    } else if (selectedFilter === 'penetration') {
      return b.properties.penetrationPower - a.properties.penetrationPower;
    }
    return 0;
  });

  return (
    <div className={styles["caliber-container"]}>
      <div className={styles["caliber-header"]} onClick={() => setShowAmmo(!showAmmo)}>
        <h2>{caliber}</h2>
        <img
          src={`/images/${caliber}.png`}
          alt={caliber}
          className={styles["caliber-image"]}
        />
        <span className={styles["toggle-indicator"]}>{showAmmo ? '▼' : '►'}</span>
      </div>

      {showAmmo && (
        <div className={styles["ammo-container"]}>
          <div className={styles["filter-controls"]}>
            <span>Sort by: </span>
            <button 
              className={selectedFilter === 'damage' ? styles["active-filter"] : ''}
              onClick={() => setSelectedFilter('damage')}
            >
              Damage
            </button>
            <button 
              className={selectedFilter === 'penetration' ? styles["active-filter"] : ''}
              onClick={() => setSelectedFilter('penetration')}
            >
              Penetration
            </button>
            <button 
              className={!selectedFilter ? styles["active-filter"] : ''}
              onClick={() => setSelectedFilter(null)}
            >
              Default
            </button>
          </div>
          
          {sortedAmmo.length > 0 ? (
            <ul className={styles["ammo-list"]}>
              {sortedAmmo.map((ammo) => (
                <li key={ammo.id} className={styles["ammo-item"]}>
                  <div className={styles["ammo-name"]} onClick={() => toggleAmmoStats(ammo.id)}>
                    {ammo.name}
                    <span className={styles["toggle-indicator"]}>{expandedAmmo === ammo.id ? '▼' : '►'}</span>
                  </div>

                  {/* Basic Stats Section */}
                  {expandedAmmo === ammo.id && (
                    <div className={styles["basic-stats"]}>
                      <div className={styles["stats-grid"]}>
                        <div className={styles["stat-box"]}>
                          <span className={styles["stat-label"]}>Damage</span>
                          <span className={styles["stat-value"]}>{ammo.properties.damage}</span>
                        </div>
                        <div className={styles["stat-box"]}>
                          <span className={styles["stat-label"]}>Penetration</span>
                          <span className={styles["stat-value"]}>{ammo.properties.penetrationPower}</span>
                        </div>
                      </div>
                      
                      {/* Trader Prices Section */}
                      <div className={styles["price-section"]}>
                        <h4>Available From:</h4>
                        {ammo.buyFor && ammo.buyFor.length > 0 ? (
                          <ul className={styles["price-list"]}>
                            {ammo.buyFor.map((price, index) => (
                              <li key={index} className={styles["price-item"]}>
                                {price.vendor?.name || price.source}: {price.price} {price.currency}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Not available from traders</p>
                        )}
                      </div>
                      
                      <button 
                        className={styles["full-stats-toggle"]}
                        onClick={() => toggleFullStats(ammo.id)}
                      >
                        {fullStatsAmmo === ammo.id ? "Hide Full Stats" : "View Full Stats"}
                      </button>

                      {/* Full Stats Section */}
                      {fullStatsAmmo === ammo.id && (
                        <div className={styles["full-stats"]}>
                          <h4>Complete Ammunition Details</h4>
                          <div className={styles["stats-grid-full"]}>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Tracer</span>
                              <span className={styles["stat-value"]}>{ammo.properties.tracer ? "Yes" : "No"}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Tracer Color</span>
                              <span className={styles["stat-value"]}>{ammo.properties.tracerColor || "N/A"}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Damage</span>
                              <span className={styles["stat-value"]}>{ammo.properties.damage}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Armor Damage</span>
                              <span className={styles["stat-value"]}>{ammo.properties.armorDamage}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Fragmentation</span>
                              <span className={styles["stat-value"]}>{ammo.properties.fragmentationChance}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Ricochet Chance</span>
                              <span className={styles["stat-value"]}>{ammo.properties.ricochetChance}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Penetration Chance</span>
                              <span className={styles["stat-value"]}>{ammo.properties.penetrationChance}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Accuracy Modifier</span>
                              <span className={styles["stat-value"]}>{ammo.properties.accuracyModifier || "N/A"}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Recoil Modifier</span>
                              <span className={styles["stat-value"]}>{ammo.properties.recoilModifier || "N/A"}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Initial Speed</span>
                              <span className={styles["stat-value"]}>{ammo.properties.initialSpeed || "N/A"}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Light Bleed</span>
                              <span className={styles["stat-value"]}>{ammo.properties.lightBleedModifier}</span>
                            </div>
                            <div className={styles["stat-box"]}>
                              <span className={styles["stat-label"]}>Heavy Bleed</span>
                              <span className={styles["stat-value"]}>{ammo.properties.heavyBleedModifier}</span>
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








