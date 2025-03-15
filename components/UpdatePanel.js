// components/UpdatesPanel.js
import React from 'react';
import styles from './UpdatesPanel.module.css';

const UpdatesPanel = () => {
  const updates = [
    {
      date: "2023-12-15",
      changes: [
        "Increased penetration of 5.45x39mm PP by 2 points",
        "Reduced damage of 9x19mm RIP by 5 points",
        "Added new 12.7x55mm ammo variant"
      ]
    },
    {
      date: "2023-11-30",
      changes: [
        "Adjusted fragmention chance for all 7.62x51mm rounds",
        "Fixed inconsistent damage values for shotgun slugs"
      ]
    }
  ];
  
  return (
    <div className={styles.updatesContainer}>
      <h3 className={styles.updatesTitle}>Recent Ammunition Updates</h3>
      <div className={styles.updatesList}>
        {updates.map((update, index) => (
          <div key={index} className={styles.updateItem}>
            <div className={styles.updateDate}>{update.date}</div>
            <ul className={styles.changesList}>
              {update.changes.map((change, changeIndex) => (
                <li key={changeIndex}>{change}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpdatesPanel;