// components/GearCategory.js
import { useState } from "react";
import ItemList from "./ItemList";
import styles from "./GearCategory.module.css";

// GearCategory creates a collapsible section for each type of gear (weapons, armor, etc.)
// This implements the first level of progressive disclosure in the loadout page
const GearCategory = ({ 
  title,        // The name of the category (e.g., "Weapons")
  icon,         // Emoji or icon to represent the category
  description,  // Short description for the category
  itemType,     // Type of items in this category (e.g., "weapon", "helmet")
  query,        // GraphQL query to fetch items for this category
  selectedItem, // Currently selected item (if any)
  onItemSelect  // Function to call when an item is selected
}) => {
  // Track whether this category is expanded or collapsed
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className={styles.categoryContainer}>
      {/* Clickable header that toggles expansion */}
      <div 
        className={styles.categoryHeader} 
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className={styles.categoryTitle}>
          <span className={styles.categoryIcon}>{icon}</span>
          <h2>{title}</h2>
        </div>
        <div className={styles.categoryInfo}>
          {/* Show the name of selected item or "Nothing selected" */}
          {selectedItem ? (
            <span className={styles.selectedItemName}>{selectedItem.name}</span>
          ) : (
            <span className={styles.emptySelection}>Nothing selected</span>
          )}
          {/* Arrow indicator shows if the section is expanded or collapsed */}
          <span className={styles.toggleIndicator}>{isExpanded ? '▼' : '►'}</span>
        </div>
      </div>
      
      {/* Content only renders when expanded - saves resources and reduces cognitive load */}
      {isExpanded && (
        <div className={styles.categoryContent}>
          <p className={styles.categoryDescription}>{description}</p>
          {/* ItemList handles displaying and filtering the actual gear items */}
          <ItemList 
            itemType={itemType} 
            query={query}
            selectedItem={selectedItem}
            onItemSelect={(item) => onItemSelect(itemType, item)}
          />
        </div>
      )}
    </div>
  );
};

export default GearCategory;