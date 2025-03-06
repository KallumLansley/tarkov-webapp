import { useState } from "react";
import AmmoList from "./AmmoList";
import styles from "./CaliberGroup.module.css";

const CaliberGroup = ({ name, calibers, isExpanded, onToggle }) => {
  return (
    <div className={styles.groupContainer}>
      <div className={styles.groupHeader} onClick={onToggle}>
        <h2 className={styles.groupTitle}>{name}</h2>
        <span className={styles.calibersCount}>{calibers.length} calibers</span>
        <span className={styles.toggleIndicator}>{isExpanded ? '▼' : '►'}</span>
      </div>

      {isExpanded && (
        <div className={styles.calibersContainer}>
          {calibers.map(caliber => (
            <AmmoList 
              key={caliber.replace(/\./g, "")} 
              caliber={caliber}
              searchTerm=""
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CaliberGroup;