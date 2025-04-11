// pages/maps.js
// a hub page that provides access to all available maps
import { useState } from "react";
import Link from "next/link";
import Footer from "../components/Footer";
import styles from "../styles/Maps.module.css";

const MapsPage = () => {
  const [isGuideExpanded, setIsGuideExpanded] = useState(false);
  
  // Maps data - can add more maps in the future
  const maps = [
    {
      id: "streets",
      name: "Streets of Tarkov",
      description: "Urban combat zone with multiple extraction points and high-value loot areas",
      image: "/images/StreetsOfTarkov.png", // Using the full map as thumbnail so its identifiable and unique looking
      path: "/maps/streets"
    },
	{
      id: "interchange",
      name: "Interchange",
      description: "Large shopping mall with underground parking and multiple floors",
      image: "/images/interchange.png",
      path: "/maps/interchange",
    },
    {
      id: "customs",
      name: "Customs",
      description: "Industrial area with a mix of indoor and outdoor combat environments",
      image: "/images/customs.png",
      path: "/maps/customs",
      comingSoon: true // Marked as coming soon
    },
    {
      id: "factory",
      name: "Factory",
      description: "Small indoor factory complex, perfect for close quarters combat",
      image: "/images/factory.png",
      path: "/maps/factory",
      comingSoon: true // Marked as coming soon
    }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link href="/">
          <span className={styles.navLink}>← Back to Home</span>
        </Link>
      </div>
      
      <h1 className={styles.title}>Escape from Tarkov Maps</h1>
      
      {/* Quick guide panel - starts collapsed like in other pages */}
      <div className={`${styles.guidePanel} ${isGuideExpanded ? '' : styles.collapsed}`}>
        {isGuideExpanded ? (
          <>
            <div className={styles.guideHeader}>
              <h2>About the Interactive Maps</h2>
              <button 
                className={styles.closeButton} 
                onClick={() => setIsGuideExpanded(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.guideContent}>
              <p>
                These interactive maps help you navigate the complex environments of Escape from Tarkov.
                Each map includes:
              </p>
              <ul>
                <li>Extract locations for PMCs and Scavs</li>
                <li>Player spawn points</li>
                <li>AI spawn areas</li>
                <li>High-risk combat zones</li>
                <li>Valuable loot locations</li>
                <li>Quest-related areas</li>
              </ul>
              <p>
                Select a map below to view the detailed interactive version with toggleable information layers.
              </p>
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
      
      {/* Map selection grid */}
      <div className={styles.mapsGrid}>
        {maps.map((map) => (
          <div key={map.id} className={`${styles.mapCard} ${map.comingSoon ? styles.comingSoon : ''}`}>
            {map.comingSoon && (
              <div className={styles.comingSoonBadge}>Coming Soon</div>
            )}
            
            <div className={styles.mapImageContainer}>
              <img 
                src={map.image} 
                alt={map.name} 
                className={styles.mapThumbnail}
              />
            </div>
            
            <div className={styles.mapInfo}>
              <h2>{map.name}</h2>
              <p>{map.description}</p>
              
              {map.comingSoon ? (
                <button className={styles.disabledButton}>
                  View Map
                </button>
              ) : (
                <Link href={map.path}>
                  <span className={styles.viewButton}>
                    View Map
                  </span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <Footer />
    </div>
  );
};

export default MapsPage;