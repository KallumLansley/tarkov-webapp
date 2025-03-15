// components/ColorKey.js
// This component was removed as it revealed too much information to the user upon initial view of the webpage.
import React from 'react';
import styles from './ColorKey.module.css';

const ColorKey = () => {
  return (
    <div className={styles.keyContainer}>
      <h3 className={styles.keyTitle}>Ammo Effectiveness Guide</h3>
      
      <div className={styles.keySection}>
        <h4>Damage Rating</h4>
        <div className={styles.keyGrid}>
          <div className={styles.keyItem}>
            <span className={`${styles.colorSwatch} ${styles.highColor}`}></span>
            <div className={styles.keyText}>
              <span className={styles.keyLabel}>High (51+)</span>
              <span className={styles.keyDescription}>Highly effective, potential one-shot kill</span>
            </div>
          </div>
          <div className={styles.keyItem}>
            <span className={`${styles.colorSwatch} ${styles.mediumColor}`}></span>
            <div className={styles.keyText}>
              <span className={styles.keyLabel}>Medium (31-50)</span>
              <span className={styles.keyDescription}>Moderate damage, multiple shots likely needed</span>
            </div>
          </div>
          <div className={styles.keyItem}>
            <span className={`${styles.colorSwatch} ${styles.lowColor}`}></span>
            <div className={styles.keyText}>
              <span className={styles.keyLabel}>Low (0-30)</span>
              <span className={styles.keyDescription}>Low damage, may require many shots</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.keySection}>
        <h4>Penetration Rating vs. Class 3 Armor</h4>
        <div className={styles.keyGrid}>
          <div className={styles.keyItem}>
            <span className={`${styles.colorSwatch} ${styles.highColor}`}></span>
            <div className={styles.keyText}>
              <span className={styles.keyLabel}>High (30+)</span>
              <span className={styles.keyDescription}>Will penetrate Class 3 armor reliably</span>
            </div>
          </div>
          <div className={styles.keyItem}>
            <span className={`${styles.colorSwatch} ${styles.mediumColor}`}></span>
            <div className={styles.keyText}>
              <span className={styles.keyLabel}>Medium (21-29)</span>
              <span className={styles.keyDescription}>May penetrate Class 3 armor after multiple hits</span>
            </div>
          </div>
          <div className={styles.keyItem}>
            <span className={`${styles.colorSwatch} ${styles.lowColor}`}></span>
            <div className={styles.keyText}>
              <span className={styles.keyLabel}>Low (0-20)</span>
              <span className={styles.keyDescription}>Unlikely to penetrate Class 3 armor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorKey;