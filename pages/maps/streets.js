// pages/maps/streets.js
// Modified from the original map.js to be specific to Streets of Tarkov
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../styles/Map.module.css";
import Footer from "../../components/Footer";
import MapTutorial from "../../components/MapTutorial";

const StreetsOfTarkovMap = () => {
  // Same state management as original map page
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
    // Only show tutorial if it hasn't been completed before
    // Using a separate key for streets map to distinguish from other maps later
    const tutorialCompleted = localStorage.getItem('streetsTutorialCompleted') === 'true';
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
      localStorage.setItem('streetsTutorialCompleted', 'true');
      handleTutorialComplete();
    }
    
    // Toggle the state
    stateSetter(!currentValue);
  };

  return (
    <div className={`${styles.container} ${isTutorialActive ? styles.pageDimmed : ''}`}>
      {/* Tutorial overlay */}
      {isTutorialActive && <MapTutorial onComplete={handleTutorialComplete} />}
      
      {/* Navigation - updated to go back to maps index instead of home */}
      <div className={styles.navigation}>
        <Link href="/maps">
          <span className={styles.navLink}>← Back to Maps</span>
        </Link>
      </div>

      <h1 className={styles.title}>Streets of Tarkov Map</h1>

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
              <p>This interactive map of Streets of Tarkov allows you to toggle different points of interest:</p>
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
                For reference, an 'extraction' is where you need to go in order to leave the map/raid.
                PMC's are the player controlled characters.
                Scav's are the A.I that hunt PMC's and shoot on sight.
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
          src="/images/StreetsOfTarkov.png"
          alt="Streets of Tarkov Map"
          className={styles.mapImage}
        />

        {/* Extract Points */}
        {showExtracts && (
          <>
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ top: "25%", left: "15%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ top: "87%", left: "5%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ top: "28%", right: "35%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ top: "95%", right: "17%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ bottom: "10%", left: "52%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ top: "42%", left: "40%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ bottom: "20%", right: "3%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ bottom: "28%", left: "18%" }} />
            <img src="/images/extract-icon.png" className={styles.mapIcon} data-label="Extraction" style={{ bottom: "37%", right: "2%" }} />
          </>
        )}

        {/* Player Spawn Points */}
        {showPlayerSpawns && (
          <>
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "20%", left: "25%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "20%", right: "33%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "34%", right: "30%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "45%", left: "11%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "48%", right: "16%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "64%", left: "24%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ top: "55%", right: "12%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ bottom: "22%", right: "10%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ bottom: "10%", left: "24%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ bottom: "3%", left: "8%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ bottom: "8%", right: "15%" }} />
            <img src="/images/player-spawn-icon.png" className={styles.mapIcon} data-label="PMC Spawn" style={{ bottom: "13%", left: "47%" }} />
          </>
        )}

        {/* Scav Spawn Points */}
        {showScavSpawns && (
          <>
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "24%", left: "27%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "32%", left: "45%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "42%", left: "44%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "31%", right: "17%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "45%", right: "35%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "56%", left: "14%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ top: "63%", right: "30%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ bottom: "22%", left: "8%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ bottom: "29%", right: "17%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ bottom: "20%", right: "35%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ bottom: "18%", left: "30%" }} />
            <img src="/images/scav-spawn-icon.png" className={styles.mapIcon} data-label="Scav Spawn" style={{ bottom: "17%", right: "11%" }} />
          </>
        )}
        
        {/* Hazard Zones */}
        {showHazardZones && (
          <>
            <div className={styles.hazardArea} data-label="Hazard Zone" style={{ top: "8%", left: "20%", width: "7%", height: "5%" }}></div>
            <div className={styles.hazardArea} data-label="Hazard Zone" style={{ top: "35%", left: "5%", width: "7%", height: "4%" }}></div>
            <div className={styles.hazardArea} data-label="Hazard Zone" style={{ top: "37%", right: "1%", width: "12%", height: "8%" }}></div>
            <div className={styles.hazardArea} data-label="Hazard Zone" style={{ bottom: "33%", left: "12%", width: "5%", height: "2%" }}></div>
            <div className={styles.hazardArea} data-label="Hazard Zone" style={{ bottom: "10%", right: "6%", width: "6%", height: "3%" }}></div>
            <div className={styles.hazardArea} data-label="Hazard Zone" style={{ bottom: "19%", left: "35%", width: "14%", height: "15%" }}></div>
          </>
        )}
        
        {/* Loot Areas */}
        {showLootAreas && (
          <>
            <div className={styles.lootArea} data-label="Good Loot" style={{ top: "55%", left: "13%", width: "10%", height: "8%" }}></div>
            <div className={styles.lootArea} data-label="Good Loot" style={{ top: "27%", right: "18%", width: "15%", height: "10%" }}></div>
            <div className={styles.lootArea} data-label="Good Loot" style={{ bottom: "30%", right: "20%", width: "15%", height: "5%" }}></div>
            <div className={styles.lootArea} data-label="Good Loot" style={{ bottom: "40%", left: "45%", width: "5%", height: "15%" }}></div>
          </>
        )}
        
        {/* Quest Areas */}
        {showQuestAreas && (
          <>
            <div className={styles.questArea} data-label="Quest Items" style={{ top: "25%", left: "40%", width: "8%", height: "10%" }}></div>
            <div className={styles.questArea} data-label="Quest Items" style={{ top: "62%", right: "40%", width: "5%", height: "5%" }}></div>
            <div className={styles.questArea} data-label="Quest Items" style={{ bottom: "14%", left: "8%", width: "15%", height: "3%" }}></div>
            <div className={styles.questArea} data-label="Quest Items" style={{ bottom: "45%", right: "1%", width: "4%", height: "6%" }}></div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default StreetsOfTarkovMap;