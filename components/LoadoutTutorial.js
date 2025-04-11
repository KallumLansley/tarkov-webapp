// components/LoadoutTutorial.js
import { useState } from "react";
import styles from "./TutorialStyles.module.css";

const LoadoutTutorial = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Handle clicking the "I understand" button so that when the user clicks the button it will never appear again by using localStorage.
  const closeTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('loadoutTutorialCompleted', 'true');
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.tutorialOverlay}>
      <div className={styles.tutorialContent}>
        <div className={styles.tutorialHeader}>
          <h2>Welcome to the Loadout Builder</h2>
        </div>
        
        <div className={styles.tutorialBody}>
          <p>
            This tool helps you build and plan your Tarkov loadout based on your trader levels.
          </p>
          
          <ul>
            <li>Set your trader levels to filter items based on what you can purchase in-game</li>
            <li>View your complete loadout cost and weight in the summary panel</li>
          </ul>
        </div>
        
        <button className={styles.understandButton} onClick={closeTutorial}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default LoadoutTutorial;