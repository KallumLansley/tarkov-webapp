// components/MapTutorial.js
import { useState } from "react";
import styles from "./MapTutorial.module.css";

const MapTutorial = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Skip the tutorial if the user doesn't want to go through it
  const skipTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('mapTutorialCompleted', 'true');
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.tutorialOverlay}>
      <div className={styles.tutorialContent}>
        <div className={styles.tutorialHeader}>
          <h2>Welcome to the Interactive Map</h2>
          <button className={styles.skipButton} onClick={skipTutorial}>
            Skip Tutorial
          </button>
        </div>
        <div className={styles.instructionBox}>
          <div className={styles.lightbulbIcon}>💡</div>
          <div className={styles.instructionText}>
            <strong>To start, click any of the control buttons</strong> in the panel above to toggle map features.
          </div>
        </div>
        <p className={styles.tutorialNote}>
          Once you click any button, the tutorial will close and you can explore freely.
        </p>
      </div>
    </div>
  );
};

export default MapTutorial;