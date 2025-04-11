// components/AmmoTutorial.js
import { useState } from "react";
import styles from "./TutorialStyles.module.css";

const AmmoTutorial = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  // Handle clicking the "I understand" button so that when the user clicks the button it will never appear again.
  const closeTutorial = () => {
    setIsVisible(false);
    localStorage.setItem('ammoTutorialCompleted', 'true');
    if (onComplete) {
      onComplete();
    }
  };

  if (!isVisible) return null;

  return (
    <div className={styles.tutorialOverlay}>
      <div className={styles.tutorialContent}>
        <div className={styles.tutorialHeader}>
          <h2>Welcome to the Ammo Guide</h2>
        </div>
        
        <div className={styles.tutorialBody}>
          <p>
            This tool helps you compare ammunition types in Escape from Tarkov.
          </p>
          
          <ul>
            <li>Click on any caliber group to expand it and see available ammunition</li>
            <li>Add up to 4 ammo types to the comparison panel at the bottom</li>
          </ul>
        </div>
        
        <button className={styles.understandButton} onClick={closeTutorial}>
          Continue
        </button>
      </div>
    </div>
  );
};

export default AmmoTutorial;