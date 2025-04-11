// pages/maps/interchange.js
// Similar structure to the Streets of Tarkov map but for Interchange, this way styling and layout is all familiar to the user.
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/Map.module.css";
import Footer from "../../components/Footer";
import MapTutorial from "../../components/MapTutorial";

const InterchangeMap = () => {
  // Same state management as in Streets map
  const [showGuide, setShowGuide] = useState(false);
  const [showExtracts, setShowExtracts] = useState(false);
  const [showPlayerSpawns, setShowPlayerSpawns] = useState(false);
  const [showScavSpawns, setShowScavSpawns] = useState(false);
  const [showHazardZones, setShowHazardZones] = useState(false);
  const [showLootAreas, setShowLootAreas] = useState(false);
  const [showQuestAreas, setShowQuestAreas] = useState(false);
  
  // Tutorial state
  const [isTutorialActive, setIsTutorialActive] = useState(false);

  // Check if tutorial has been completed before
  useEffect(() => {
    // Using a separate key for interchange map
    const tutorialCompleted = localStorage.getItem('interchangeTutorialCompleted') === 'true';
    setIsTutorialActive(!tutorialCompleted);
    
    // Add highlight to controls section during tutorial
    if (!tutorialCompleted) {
      const controlsElement = document.querySelector('.controls');
      if (controlsElement) {
        controlsElement.classList.add('controlsHighlight');
      }
    }
  }, []);

  // Handler for completing the tutorial
  const handleTutorialComplete = () => {
    setIsTutorialActive(false);
    // Remove highlight from controls
    const controlsElement = document.querySelector('.controls');
    if (controlsElement) {
      controlsElement.classList.remove('controlsHighlight');
    }
  };

  // Handler for control button clicks
  const handleControlClick = (stateSetter, currentValue) => {
    // If tutorial is active, complete it regardless of which button was clicked
    if (isTutorialActive) {
      localStorage.setItem('interchangeTutorialCompleted', 'true');
      handleTutorialComplete();
    }
    
    // Toggle the state
    stateSetter(!currentValue);
  };

  return (
    <div className={`${styles.container} ${isTutorialActive ? styles.pageDimmed : ''}`}>
      {/* Tutorial overlay */}
      {isTutorialActive && <MapTutorial onComplete={handleTutorialComplete} />}
      
      {/* Navigation */}
      <div className={styles.navigation}>
        <Link href="/maps">
          <span className={styles.navLink}>← Back to Maps</span>
        </Link>
      </div>

      <h1 className={styles.title}>Interchange Map</h1>

      {/* Guide Panel */}
      <div className={`${styles.guidePanel} ${showGuide ? "" : styles.collapsed}`}>
        {showGuide ? (
          <>
            <div className={styles.guideHeader}>
              <h2>How to Use the Map</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowGuide(false)}
              >
                ✕
              </button>
            </div>
            <div className={styles.guideContent}>
              <p>This interactive map of Interchange allows you to toggle different points of interest:</p>
              <ul>
                <li>Use the toggle buttons to show or hide different types of locations</li>
                <li>
                  <img src="/images/extract-icon.png" alt="Extract" className={styles.inlineIcon} />
                  This icon shows extraction points
                </li>
                <li>
                  <img src="/images/player-spawn-icon.png" alt="PMC Spawn" className={styles.inlineIcon} />
                  These pins show PMC spawn locations
                </li>
                <li>
                  <img src="/images/scav-spawn-icon.png" alt="Scav Spawn" className={styles.inlineIcon} />
                  These pins show Scav spawn locations
                </li>
                <li>
                  <span className={styles.inlineHazardIcon}></span>
                  Red areas indicate hazard zones with high player traffic and danger
                </li>
                <li>
                  <span className={styles.inlineLootIcon}></span>
                  Green areas show locations with valuable loot
                </li>
                <li>
                  <span className={styles.inlineQuestIcon}></span>
                  Yellow areas indicate quest item locations
                </li>
              </ul>
              <p>
                The Interchange is a large shopping mall complex with multiple floors. This view shows the ground floor layout.
              </p>
            </div>
          </>
        ) : (
          <button 
            className={styles.expandButton} 
            onClick={() => setShowGuide(true)}
          >
            Show Guide
          </button>
        )}
      </div>

      {/* Controls */}
      <div className={`${styles.controls} ${isTutorialActive ? styles.controlsActive : ''}`}>
        <button
          className={`${styles.controlButton} ${showExtracts ? styles.active : ""}`}
          onClick={() => handleControlClick(setShowExtracts, showExtracts)}
        >
          <img src="/images/extract-icon.png" alt="Extract" className={styles.controlIcon} />
          Extractions
        </button>

        <button
          className={`${styles.controlButton} ${showPlayerSpawns ? styles.active : ""}`}
          onClick={() => handleControlClick(setShowPlayerSpawns, showPlayerSpawns)}
        >
          <img src="/images/player-spawn-icon.png" alt="PMC Spawn" className={styles.controlIcon} />
          PMC Spawns
        </button>

        <button
          className={`${styles.controlButton} ${showScavSpawns ? styles.active : ""}`}
          onClick={() => handleControlClick(setShowScavSpawns, showScavSpawns)}
        >
          <img src="/images/scav-spawn-icon.png" alt="Scav Spawn" className={styles.controlIcon} />
          Scav Spawns
        </button>
        
        <button
          className={`${styles.controlButton} ${showHazardZones ? styles.active : ""}`}
          onClick={() => handleControlClick(setShowHazardZones, showHazardZones)}
        >
          <span className={styles.hazardIcon}></span>
          Hazard Zones
        </button>
        
        <button
          className={`${styles.controlButton} ${showLootAreas ? styles.active : ""}`}
          onClick={() => handleControlClick(setShowLootAreas, showLootAreas)}
        >
          <span className={styles.lootIcon}></span>
          Loot Areas
        </button>
        
        <button
          className={`${styles.controlButton} ${showQuestAreas ? styles.active : ""}`}
          onClick={() => handleControlClick(setShowQuestAreas, showQuestAreas)}
        >
          <span className={styles.questIcon}></span>
          Quest Areas
        </button>
      </div>

      {/* Map Container */}
      <div className={`${styles.mapContainer} ${isTutorialActive ? styles.dimmedMap : ''}`}>
        {/* Base Map Image */}
        <img
          src="/images/interchange.png"
          alt="Interchange Map"
          className={styles.mapImage}
        />

        {/* Extract Points - Starting with placeholder positions */}
        {showExtracts && (
          <>
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Emercom Checkpoint" style={{ bottom: "15%", right: "0%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Railway Exfil" style={{ top: "6%", left: "6.5%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Hole in Fence" style={{ bottom: "2%", left: "30.25%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Power Station" style={{ top: "12%", right: "7%" }} />
          </>
        )}

        {/* Player Spawn Points - Starting with placeholder positions */}
        {showPlayerSpawns && (
          <>
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "15%", left: "11%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "30%", right: "11%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "50%", left: "31%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ bottom: "18%", right: "7%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ bottom: "10%", left: "35%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "16%", left: "50%" }} />
          </>
        )}

        {/* Scav Spawn Points - Starting with placeholder positions */}
        {showScavSpawns && (
          <>
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "25%", left: "43%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "31%", right: "21%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "60%", left: "30%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ bottom: "30%", right: "25%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ bottom: "45%", left: "55%" }} />
          </>
        )}
        
        {/* Hazard Zones - Starting with placeholder positions */}
        {showHazardZones && (
          <>
            <div className={styles.hazardArea} data-label="High Traffic" style={{ top: "2%", left: "28%", width: "6%", height: "5%" }}></div>
          </>
        )}
        
        {/* Loot Areas - Starting with placeholder positions */}
        {showLootAreas && (
          <>
            <div className={styles.lootArea} data-label="IDEA Loot" style={{ top: "19%", right: "26%", width: "5%", height: "14%" }}></div>
            <div className={styles.lootArea} data-label="OLI Loot" style={{ bottom: "24%", right: "20%", width: "10%", height: "14%" }}></div>
            <div className={styles.lootArea} data-label="GOSHAN Loot" style={{ top: "33%", right: "17%", width: "12%", height: "6%" }}></div>
            <div className={styles.lootArea} data-label="Tech Stores" style={{ top: "54%", left: "52%", width: "15%", height: "7%" }}></div>
          </>
        )}
        
        {/* Quest Areas - Starting with placeholder positions */}
        {showQuestAreas && (
          <>
            <div className={styles.questArea} data-label="Quest Items" style={{ top: "18.5%", right: "35%", width: "6%", height: "2%" }}></div>
            <div className={styles.questArea} data-label="Quest Items" style={{ bottom: "54%", left: "52%", width: "9%", height: "4%" }}></div>
            <div className={styles.questArea} data-label="Quest Items" style={{ bottom: "24%", right: "47%", width: "3%", height: "6%" }}></div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default InterchangeMap;