//CaliberGroup.js
import { useState } from "react";
import AmmoList from "./AmmoList";
import styles from "./CaliberGroup.module.css";

// This component handles a group of calibers (like "Shotgun Calibers")
// It's a simple container component that helps organise the UI
const CaliberGroup = ({ name, calibers, isExpanded, onToggle, randomCaliber, randomAmmoId }) => {
  return (
    <div className={styles.groupContainer}>
      {/* Clickable header that expands/collapses the group */}
      <div className={styles.groupHeader} onClick={onToggle}>
        <h2 className={styles.groupTitle}>{name}</h2>
        {/* Show count of calibers to give users an idea of what's inside */}
        <span className={styles.calibersCount}>{calibers.length} calibers</span>
        {/* Visual indicator of expanded state */}
        <span className={styles.toggleIndicator}>{isExpanded ? '▼' : '►'}</span>
      </div>

      {/* Only render calibers when expanded - saves rendering time and reduces clutter */}
      {isExpanded && (
        <div className={styles.calibersContainer}>
          {/* Map each caliber to an AmmoList component */}
          {calibers.map(caliber => (
            <AmmoList 
              key={caliber.replace(/\./g, "")} 
              caliber={caliber}
              searchTerm=""
              // Pass through random selection props to highlight the right ammo
              isRandomTarget={randomCaliber === caliber}
              randomAmmo={randomCaliber === caliber ? randomAmmoId : null}
              id={`caliber-${caliber.replace(/\./g, "")}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CaliberGroup;