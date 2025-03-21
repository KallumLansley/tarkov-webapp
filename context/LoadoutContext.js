// context/LoadoutContext.js
import { createContext, useState, useContext, useEffect } from "react";

// Create a context to share loadout data across components without prop drilling
const LoadoutContext = createContext();

// This provider wraps the app and makes loadout data available everywhere
export function LoadoutProvider({ children }) {
  // Set up trader levels - start everyone at level 1
  // These control what items are available to the user
  const [traders, setTraders] = useState({
    prapor: 1,
    therapist: 1,
    fence: 1,
    skier: 1,
    peacekeeper: 1,
    mechanic: 1,
    ragman: 1,
    jaeger: 1
  });
  
  // Keep track of what gear the user has selected for their loadout
  // Everything starts as null (nothing selected)
  const [selectedLoadout, setSelectedLoadout] = useState({
    weapon: null,
    helmet: null,
    headphones: null,
    armor: null,
    rig: null,
    backpack: null
  });
  
  // Function to update a specific gear slot with a new item
  // For example, when the user selects a new helmet
  const updateLoadoutItem = (category, item) => {
    setSelectedLoadout(prev => ({
      ...prev,
      [category]: item
    }));
  };
  
  // Check if an item should be shown based on the user's trader levels
  // This filters out items the user can't actually buy in-game
  const isItemAvailable = (item) => {
    if (!item) return false;
    
    // First check if any trader sells this item directly
    // The Flea Market is ignored since the focus is on trader-only items
    const canBuy = item.buyFor && item.buyFor.some(purchase => {
      const trader = purchase.vendor?.name;
      if (!trader || trader === "Flea Market") return false;
      
      // Find what loyalty level is required for this trader
      const traderLevelReq = purchase.requirements?.find(req => req.type === "loyaltyLevel");
      const requiredLevel = traderLevelReq ? traderLevelReq.value : 1;
      
      // Check if the user's trader level is high enough
      return traders[trader.toLowerCase()] >= requiredLevel;
    });
    
    // Also check if the item is available through barter trades
    const canBarter = item.bartersFor && item.bartersFor.some(barter => {
      const trader = barter.trader?.name;
      if (!trader) return false;
      
      // Check if user's trader level meets the barter requirement
      return traders[trader.toLowerCase()] >= barter.level;
    });
    
    // Item is available if it can be bought OR bartered
    return canBuy || canBarter;
  };
  
  // Gets price info from traders only (filters out Flea Market)
  const getTraderPrices = (buyFor) => {
    if (!buyFor || buyFor.length === 0) return [];
    return buyFor.filter(price => price.vendor?.name !== "Flea Market");
  };
  
  // Add up the cost of the entire loadout based on cheapest trader prices
  const calculateTotalCost = () => {
    let total = 0;
    Object.values(selectedLoadout).forEach(item => {
      if (item && item.buyFor && item.buyFor.length > 0) {
        // Find the cheapest trader price for this item
        const traderPrices = getTraderPrices(item.buyFor);
        if (traderPrices.length > 0) {
          const cheapestPrice = Math.min(...traderPrices.map(p => p.price));
          total += cheapestPrice;
        }
      }
    });
    return total;
  };
  
  // Save trader levels to localStorage when they change
  // This way the user's settings persist between visits
  useEffect(() => {
    localStorage.setItem('tarkovLoadoutTraders', JSON.stringify(traders));
  }, [traders]);
  
  // Load saved trader levels when the app starts
  useEffect(() => {
    const savedTraders = localStorage.getItem('tarkovLoadoutTraders');
    if (savedTraders) {
      try {
        setTraders(JSON.parse(savedTraders));
      } catch (e) {
        console.error("Error loading saved trader levels:", e);
      }
    }
  }, []);
  
  // Make all these functions and state available to the rest of the app
  return (
    <LoadoutContext.Provider value={{
      traders,
      setTraders,
      selectedLoadout,
      updateLoadoutItem,
      isItemAvailable,
      getTraderPrices,
      calculateTotalCost
    }}>
      {children}
    </LoadoutContext.Provider>
  );
}

// Custom hook to make it easier to access the loadout context
// This lets components use useLoadout() instead of useContext(LoadoutContext)
export function useLoadout() {
  return useContext(LoadoutContext);
}