// components/UserProfile.js
import { useState } from "react";
import { useLoadout } from "../context/LoadoutContext";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const { traders, setTraders } = useLoadout();
  // Changed to true so that it is expanded and the user can be drawn to it as it leads to the rest of the page.
  const [isExpanded, setIsExpanded] = useState(true);
  
  const handleTraderChange = (trader, level) => {
    setTraders(prev => ({
      ...prev,
      [trader]: level
    }));
  };
  
  const traderNames = {
    prapor: "Prapor",
    therapist: "Therapist",
    fence: "Fence",
    skier: "Skier",
    peacekeeper: "Peacekeeper",
    mechanic: "Mechanic",
    ragman: "Ragman",
    jaeger: "Jaeger"
  };
  
  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader} onClick={() => setIsExpanded(!isExpanded)}>
        <h2>Trader Levels</h2>
        <span className={styles.toggleIndicator}>{isExpanded ? '▼' : '►'}</span>
      </div>
      
      {isExpanded && (
        <div className={styles.profileDetails}>
          <p className={styles.profileDescription}>
            Set your trader levels to filter items that you can actually purchase. 
            Only items available from traders at your selected levels will be shown.
			The loadout summary will provide an overall price and weight of the equipment selected from the categories shown.
          </p>
          
          <div className={styles.tradersContainer}>
            <div className={styles.traderGrid}>
              {Object.entries(traders).map(([trader, level]) => (
                <div key={trader} className={styles.traderItem}>
                  <span className={styles.traderName}>{traderNames[trader]}</span>
                  <div className={styles.traderLevels}>
                    {[1, 2, 3, 4].map((l) => (
                      <button
                        key={l}
                        className={`${styles.levelButton} ${level === l ? styles.activeLevel : ''}`}
                        onClick={() => handleTraderChange(trader, l)}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;