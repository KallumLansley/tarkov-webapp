// components/FilterToolbar.js
import React from 'react';
import styles from './FilterToolbar.module.css';

const FilterToolbar = ({ activeFilters, setActiveFilters }) => {
  const toggleFilter = (filter) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter(f => f !== filter));
    } else {
      setActiveFilters([...activeFilters, filter]);
    }
  };
  
  return (
    <div className={styles.toolbarContainer}>
      <div className={styles.filterLabel}>Quick Filters:</div>
      <div className={styles.filterButtons}>
        <button 
          className={`${styles.filterButton} ${activeFilters.includes('highDamage') ? styles.active : ''}`}
          onClick={() => toggleFilter('highDamage')}
        >
          High Damage
        </button>
        <button 
          className={`${styles.filterButton} ${activeFilters.includes('highPen') ? styles.active : ''}`}
          onClick={() => toggleFilter('highPen')}
        >
          High Penetration
        </button>
        <button 
          className={`${styles.filterButton} ${activeFilters.includes('tracer') ? styles.active : ''}`}
          onClick={() => toggleFilter('tracer')}
        >
          Tracer Rounds
        </button>
        <button 
          className={`${styles.filterButton} ${activeFilters.includes('available') ? styles.active : ''}`}
          onClick={() => toggleFilter('available')}
        >
          Available from Traders
        </button>
      </div>
    </div>
  );
};

export default FilterToolbar;