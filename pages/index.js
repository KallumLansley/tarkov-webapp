// pages/index.js
import { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import styles from "../styles/HomePage.module.css";

const HomePage = () => {
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Escape from Tarkov Companion</h1>
      
      {/* Welcome Guide Panel */}
      <div className={`${styles.guidePanel} ${isGuideExpanded ? '' : styles.collapsed}`}>
        {isGuideExpanded ? (
          <>
            <div className={styles.guideHeader}>
              <h2>Welcome to the Tarkov Companion</h2>
              <button 
                className={styles.closeButton} 
                onClick={() => setIsGuideExpanded(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.guideContent}>
              <p>This interactive tool helps Escape from Tarkov players by providing access to:</p>
              <ul>
                <li><strong>Ammo Guide:</strong> Compare ammunition stats, damage, and penetration values</li>
                <li><strong>Loadout Builder:</strong> Create equipment loadouts based on your trader levels</li>
                <li><strong>Maps:</strong> Interactive Streets of Tarkov map with extract locations and spawns (More maps coming soon!)</li>
              </ul>
              <p>All tools use progressive disclosure to reduce information overload, showing only what you need when you need it.</p>
            </div>
          </>
        ) : (
          <button 
            className={styles.expandButton}
            onClick={() => setIsGuideExpanded(true)}
          >
            Show Guide
          </button>
        )}
      </div>
      
      {/* Main Navigation Buttons */}
      <div className={styles.buttonContainer}>
        <Link href="/ammo">
          <div className={styles.navButton}>
            <div className={styles.buttonIcon}>🔫</div>
            <h2>Ammo Guide</h2>
            <p>Compare ammunition stats, damage, and penetration values</p>
          </div>
        </Link>
        
        <Link href="/loadout">
          <div className={styles.navButton}>
            <div className={styles.buttonIcon}>🦺</div>
            <h2>Loadout Builder</h2>
            <p>Create equipment loadouts based on your trader levels</p>
          </div>
        </Link>
        
				<Link href="/maps">
		  <div className={styles.navButton}>
			<div className={styles.buttonIcon}>🗺️</div>
			<h2>Maps</h2>
			<p>Interactive Streets of Tarkov map with extracts and spawns, more maps to come!</p>
		  </div>
		</Link>
      </div>
      
      <Footer />
    </div>
  );
};

export default HomePage;