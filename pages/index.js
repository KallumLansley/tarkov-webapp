// pages/index.js
import { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import AmmoList from "../components/AmmoList";
import AmmoComparison from "../components/AmmoComparison";
import CaliberGroup from "../components/CaliberGroup";
import WelcomePanel from "../components/WelcomePanel";
import Footer from "../components/Footer";
import Link from "next/link";
import { GET_ALL_AMMO } from "../services/api/queries";
import styles from "../styles/Home.module.css";

// I grouped calibers to reduce cognitive load on initial page load
// Categorising them makes it easier for users to find what they need
const caliberGroups = [
  {
    name: "Shotgun Calibers",
    calibers: ["12 Gauge Shot", "20 Gauge", "23x75mm"]
  },
  {
    name: "Small Calibers",
    calibers: ["9x18mm", "7.62x25mm", "9x19mm", "45 ACP", "9x21mm", "357 Magnum", "5.7x28mm", "4.6x30mm"]
  },
  {
    name: "Medium Calibers",
    calibers: ["9x39mm", "366 TKM", "5.45x39mm", "5.56x45mm", "7.62x39mm", "300 BLK"]
  },
  {
    name: "Large Calibers",
    calibers: ["6.8x51mm", "7.62x51mm", "7.62x54R", "12.7x55mm", "338 Lapua Magnum"]
  }
];

// This flattened list is useful for random selection functionality
const allCalibers = caliberGroups.flatMap(group => group.calibers);

// This mapping was a pain to create - had to look through API docs to figure out 
// how calibers are formatted in the database vs how they're displayed in-game
const caliberMapping = {
  "Caliber556x45NATO": "5.56x45mm",
  "Caliber12g": "12 Gauge Shot",
  "Caliber20g": "20 Gauge",
  "Caliber23x75": "23x75mm",
  "Caliber9x18PM": "9x18mm",
  "Caliber762x25TT": "7.62x25mm",
  "Caliber9x19PARA": "9x19mm",
  "Caliber1143x23ACP": "45 ACP",
  "Caliber40x46": "40x46mm", 
  "Caliber545x39": "5.45x39mm",
  "Caliber762x39": "7.62x39mm",
  "Caliber762x51": "7.62x51mm",
  "Caliber762x54R": "7.62x54R",
  "Caliber127x55": "12.7x55mm",
  "Caliber9x39": "9x39mm",
  "Caliber366TKM": "366 TKM",
  "Caliber46x30": "4.6x30mm",
  "Caliber57x28": "5.7x28mm",
  "Caliber9x21": "9x21mm",
  "Caliber68x51": "6.8x51mm",
  "Caliber762x35": "300 BLK",
  "Caliber86x70": "338 Lapua Magnum", 
  "Caliber9x33R": "357 Magnum", 
};

export default function Home() {
  // Main state management for the app - using hooks to manage expansion and search
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [randomCaliber, setRandomCaliber] = useState(null);
  const [randomAmmoId, setRandomAmmoId] = useState(null);
  const [isRandomLoading, setIsRandomLoading] = useState(false);
  
  // Fetch all ammo data using Apollo Client
  const { data: ammoData, loading: ammoLoading } = useQuery(GET_ALL_AMMO);
  
  // Simple check for whether search is active - helps control display
  const isSearchActive = searchTerm.trim().length > 0;

  // Helper function to find which group a caliber belongs to
  const findCaliberGroup = (caliber) => {
    for (let i = 0; i < caliberGroups.length; i++) {
      if (caliberGroups[i].calibers.includes(caliber)) {
        return i;
      }
    }
    return null;
  };

  // This random ammo feature helps users discover new ammo types
  const loadRandomAmmo = () => {
    // Guard clause to prevent multiple clicks or running when data isn't ready
    if (isRandomLoading || ammoLoading || !ammoData || !ammoData.items || ammoData.items.length === 0) return;
    
    setIsRandomLoading(true);

    try {
      // This filtering was necessary because some ammo in the API has weird/missing caliber data
      const validAmmo = ammoData.items.filter(
        ammo => ammo.properties && ammo.properties.caliber && caliberMapping[ammo.properties.caliber]
      );
      
      if (validAmmo.length === 0) return;

      // Basic random selection - Math.random() works fine for this non-critical feature
      const randomAmmoIndex = Math.floor(Math.random() * validAmmo.length);
      const randomAmmo = validAmmo[randomAmmoIndex];
      
      // Map the internal caliber name to display name
      const caliber = randomAmmo.properties.caliber;
      const caliberDisplayName = caliberMapping[caliber];
      
      if (!caliberDisplayName) return;
      
      // Find group index for the selected caliber
      const groupIndex = findCaliberGroup(caliberDisplayName);
      
      // Reset existing selections first to avoid UI conflicts
      setRandomCaliber(null);
      setRandomAmmoId(null);
      
      // Had to use these timeouts to ensure state updates complete
      setTimeout(() => {
        // Update state to reflect new random selection
        setExpandedGroup(groupIndex);
        setRandomCaliber(caliberDisplayName);
        setRandomAmmoId(randomAmmo.id);
        
        // Auto-scroll to the selected ammo after rendering is complete
        setTimeout(() => {
          const element = document.getElementById(`ammo-${randomAmmo.id}`);
          if (element) {
            // Smooth scroll to bring the element into view
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
          setIsRandomLoading(false);
        }, 500);
      }, 100);
    } catch (error) {
      console.error("Error selecting random ammo:", error);
      setIsRandomLoading(false);
    }
  };

  // Handle toggling of caliber groups (expand/collapse)
  const handleToggleGroup = (index) => {
    // If this is the group with our random selection, need to clear random state first
    if (randomCaliber && findCaliberGroup(randomCaliber) === index) {
      setRandomCaliber(null);
      setRandomAmmoId(null);
    }
    
    // Standard toggle behavior - if already expanded, collapse it, otherwise expand it
    setExpandedGroup(expandedGroup === index ? null : index);
  };

  return (
    <div className={styles.container}>
      <div className={styles.navigation}>
        <Link href="/loadout">
          <span className={styles.navLink}>Go to Loadout Builder →</span>
        </Link>
      </div>
      
      <h1 className={styles.title}>Escape from Tarkov Ammo Data</h1>
      
      {/* Moved WelcomePanel below the title to match loadout page layout */}
      <WelcomePanel />
      
      <div className={styles.searchControls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search for ammo by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <button 
          className={`${styles.randomButton} ${isRandomLoading ? styles.randomButtonLoading : ''}`}
          onClick={loadRandomAmmo}
          disabled={isRandomLoading || ammoLoading}
        >
          <span className={styles.randomIcon}>🎲</span>
          {isRandomLoading ? "Loading..." : "Random Ammo"}
        </button>
      </div> 
      
      {/* 
        This conditional rendering switches between two display modes:
        1. Search mode: flat list of all calibers matching search
        2. Normal mode: grouped calibers in collapsible sections
      */}
      {isSearchActive ? (
        // Search mode - flat list for easier scanning of results
        <>
          {caliberGroups.flatMap(group => 
            group.calibers.map(caliber => (
              <AmmoList 
                key={caliber.replace(/\./g, "")} 
                caliber={caliber} 
                searchTerm={searchTerm}
                isRandomTarget={randomCaliber === caliber}
                randomAmmo={randomCaliber === caliber ? randomAmmoId : null}
                id={`caliber-${caliber.replace(/\./g, "")}`}
              />
            ))
          )}
        </>
      ) : (
        // Normal mode - grouped by caliber category
        <>
          {caliberGroups.map((group, index) => (
            <CaliberGroup 
              key={group.name} 
              name={group.name} 
              calibers={group.calibers} 
              isExpanded={expandedGroup === index}
              onToggle={() => handleToggleGroup(index)}
              randomCaliber={randomCaliber}
              randomAmmoId={randomAmmoId}
            />
          ))}
        </>
      )}

      <Footer />
      
      {/* Comparison panel stays at the bottom for easy access */}
      <AmmoComparison />
    </div>
  );
}