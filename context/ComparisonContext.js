//ComparisonContext.js
import { createContext, useState, useContext } from "react";

// Create a context for sharing comparison state across components
// This was my first time using context in React, took a bit to understand
const ComparisonContext = createContext();

// Provider component that wraps the app and provides comparison functionality
export function ComparisonProvider({ children }) {
  // State to track which ammo types are being compared
  // Limit to 4 items for a reasonable comparison view, it was 6 at first but took up too much screen space.
  const [comparisonList, setComparisonList] = useState([]);
  
  // Add an ammo type to comparison if not already present and under limit
  // The duplicate check prevents comparing the same ammo twice
  const addToComparison = (ammo) => {
    if (comparisonList.length < 4 && !comparisonList.find(item => item.id === ammo.id)) {
      setComparisonList([...comparisonList, ammo]);
    }
  };
  
  // Remove an ammo type from comparison by ID
  // This is cleaner than removing by index or name which could be ambiguous
  const removeFromComparison = (ammoId) => {
    setComparisonList(comparisonList.filter(ammo => ammo.id !== ammoId));
  };
  
  // Clear all items from comparison
  // Simple but useful convenience function
  const clearComparison = () => {
    setComparisonList([]);
  };
  
  // Provide the comparison state and functions to children
  // This pattern makes it available throughout the app without prop drilling
  return (
    <ComparisonContext.Provider value={{
      comparisonList,
      addToComparison,
      removeFromComparison,
      clearComparison
    }}>
      {children}
    </ComparisonContext.Provider>
  );
}

// Custom hook for easier access to the comparison context
// Found this pattern online, it's much cleaner than importing useContext everywhere
export function useComparison() {
  return useContext(ComparisonContext);
}