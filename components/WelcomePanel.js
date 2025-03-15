// components/WelcomePanel.js
import React, { useState } from 'react';
import styles from './WelcomePanel.module.css';

const WelcomePanel = () => {
  const [isExpanded, setIsExpanded] = useState(false); // This is set to false to stay true to the focus on progressive disclosure.
  
  return (
    <div className={`${styles.welcomePanel} ${isExpanded ? '' : styles.collapsed}`}>
      {isExpanded ? (
        <>
          <div className={styles.welcomeHeader}>
            <h2>Welcome to the Tarkov Ammo Guide</h2>
            <button 
              className={styles.closeButton} 
              onClick={() => setIsExpanded(false)}
            >
              ✕
            </button>
          </div>
          <div className={styles.welcomeContent}>
            <p>This interactive tool helps you find and compare ammunition in Escape from Tarkov. Here's how to use it:</p>
            <ul>
              <li>Click on a caliber group to explore available ammo types</li>
              <li>Use the search bar to find specific ammunition</li>
              <li>Click "Add to Compare" to compare up to 4 different ammo types</li>
              <li>Color coding indicates damage and armor penetration effectiveness</li>
            </ul>
          </div>
        </>
      ) : (
        <button 
          className={styles.expandButton}
          onClick={() => setIsExpanded(true)}
        >
          Show Guide
        </button>
      )}
    </div>
  );
};

export default WelcomePanel;