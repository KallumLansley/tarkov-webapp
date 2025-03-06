import { createContext, useState, useContext } from "react";

const ComparisonContext = createContext();

export function ComparisonProvider({ children }) {
  const [comparisonList, setComparisonList] = useState([]);
  
  const addToComparison = (ammo) => {
    if (comparisonList.length < 4 && !comparisonList.find(item => item.id === ammo.id)) {
      setComparisonList([...comparisonList, ammo]);
    }
  };
  
  const removeFromComparison = (ammoId) => {
    setComparisonList(comparisonList.filter(ammo => ammo.id !== ammoId));
  };
  
  const clearComparison = () => {
    setComparisonList([]);
  };
  
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

export function useComparison() {
  return useContext(ComparisonContext);
}