// components/ArmorSimulator.js
import React, { useState } from 'react';
import styles from './ArmorSimulator.module.css';

const ArmorSimulator = ({ ammo }) => {
  const [selectedArmor, setSelectedArmor] = useState(3); // Default Class 3
  const [shotsToKill, setShotsToKill] = useState(0);
  
  // Simulate on ammo or armor change
  React.useEffect(() => {
    if (ammo) {
      // This is a simplified simulation
      const pen = ammo.properties.penetrationPower;
      const damage = ammo.properties.damage;
      
      // Calculate shots to penetrate
      let shots = 1;
      if (pen < selectedArmor * 10) {
        shots = Math.ceil((selectedArmor * 10) / pen);
      }
      
      // Calculate shots to kill after penetration
      const damageAfterArmor = damage * 0.7; // 30% reduction
      const shotsToKill = Math.ceil(80 / damageAfterArmor); // Assume 80 health
      
      setShotsToKill(shots + shotsToKill - 1);
    }
  }, [ammo, selectedArmor]);
  
  return (
    <div className={styles.simulatorContainer}>
      <h3>Armor Performance Simulator</h3>
      
      <div className={styles.armorSelector}>
        <label>Select Armor Class:</label>
        <div className={styles.armorButtons}>
          {[1, 2, 3, 4, 5, 6].map(armorClass => (
            <button
              key={armorClass}
              className={`${styles.armorButton} ${selectedArmor === armorClass ? styles.selectedArmor : ''}`}
              onClick={() => setSelectedArmor(armorClass)}
            >
              Class {armorClass}
            </button>
          ))}
        </div>
      </div>
      
      <div className={styles.simulationResult}>
        <div className={styles.resultLabel}>Estimated shots to kill:</div>
        <div className={styles.resultValue}>{shotsToKill}</div>
      </div>
    </div>
  );
};

export default ArmorSimulator;