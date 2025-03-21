// components/LoadoutFooter.js
import React from 'react';
import styles from './LoadoutFooter.module.css';

const LoadoutFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>About This Tool</h3>
          <p>This interactive Tarkov loadout builder was created to help players plan their gear based on available trader levels, implementing progressive disclosure and interactive filtering techniques to make complex information more manageable.</p>
        </div>
        
        <div className={styles.footerSection}>
          <h3>Important Notes</h3>
          <p>All data is sourced from the Tarkov.dev API and may change with game updates. This tool is not affiliated with Battlestate Games. Prices and availability are based on trader levels.</p>
        </div>
        
        <div className={styles.footerSection}>
          <h3>Resources</h3>
          <ul>
            <li><a href="https://tarkov.dev/" target="_blank" rel="noopener noreferrer">Tarkov.dev API</a></li>
            <li><a href="https://escapefromtarkov.fandom.com/wiki/Ballistics" target="_blank" rel="noopener noreferrer">Tarkov Wiki</a></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>© 2025 Kallum Lansley - Created for a university research project on progressive disclosure in data-heavy applications.</p>
      </div>
    </footer>
  );
};

export default LoadoutFooter;