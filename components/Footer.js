// components/Footer.js
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.footerSection}>
          <h3>About This Tool</h3>
          <p>This interactive Tarkov ammunition guide was created to help players navigate the complex ammunition system in Escape from Tarkov using progressive disclosure and interactive filtering techniques.</p>
        </div>
        
        <div className={styles.footerSection}>
          <h3>Important Notes</h3>
          <p>All data is sourced from the Tarkov.dev API and may change with game updates. This tool is not affiliated with Battlestate Games.</p>
        </div>
        
        <div className={styles.footerSection}>
          <h3>Resources</h3>
          <ul>
            <li><a href="https://escapefromtarkov.fandom.com/wiki/Ballistics" target="_blank" rel="noopener noreferrer">Tarkov Wiki: Ballistics</a></li>
            <li><a href="https://tarkov.dev/" target="_blank" rel="noopener noreferrer">Tarkov.dev API</a></li>
          </ul>
        </div>
      </div>
      
      <div className={styles.footerBottom}>
        <p>© 2025 Kallum Lansley - Created for university research project on progressive disclosure in data-heavy applications.</p>
      </div>
    </footer>
  );
};

export default Footer;