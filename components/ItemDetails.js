// components/ItemDetails.js
import styles from "./ItemDetails.module.css";

// ItemDetails shows comprehensive information about a specific item 
// This is the third level of progressive disclosure in the loadout page
const ItemDetails = ({ item, itemType }) => {
  // Makes price numbers look nice with commas and the right currency
  const formatPrice = (price, currency) => {
    return `${price.toLocaleString()} ${currency}`;
  };
  
  // Finds the cheapest trader price for this item
  const getBestPrice = () => {
    if (!item.buyFor || item.buyFor.length === 0) {
      return "Not available from traders";
    }
    
    // Skip flea market prices, only looking at trader prices
    const traderPrices = item.buyFor.filter(price => price.vendor?.name !== "Flea Market");
    
    if (traderPrices.length === 0) {
      return "Not available from traders";
    }
    
    // Find the lowest price from all traders
    const lowestPrice = traderPrices.reduce((lowest, current) => {
      if (!lowest || current.price < lowest.price) {
        return current;
      }
      return lowest;
    }, null);
    
    if (lowestPrice) {
      return `${lowestPrice.vendor?.name || "Unknown"}: ${formatPrice(lowestPrice.price, lowestPrice.currency)}`;
    }
    
    return "Price not available";
  };
  
  // Each type of item (weapon, armor, etc.) has different important stats to show
  // This function displays the right stats based on the item type
  const renderSpecificDetails = () => {
    switch (itemType) {
      case 'weapon':
        return (
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Caliber</span>
              <span className={styles.statValue}>{item.properties?.caliber || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Fire Rate</span>
              <span className={styles.statValue}>{item.properties?.fireRate || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Ergonomics</span>
              <span className={styles.statValue}>{item.properties?.ergonomics || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Vertical Recoil</span>
              <span className={styles.statValue}>{item.properties?.recoilVertical || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Horizontal Recoil</span>
              <span className={styles.statValue}>{item.properties?.recoilHorizontal || "N/A"}</span>
            </div>
          </div>
        );
        
      case 'armor':
      case 'helmet':
        return (
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Class</span>
              <span className={styles.statValue}>{item.properties?.class || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Durability</span>
              <span className={styles.statValue}>{item.properties?.durability || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Material</span>
              <span className={styles.statValue}>{item.properties?.material?.name || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Protected Areas</span>
              <span className={styles.statValue}>
                {/* Helmets and body armor use different property names for zones */}
                {itemType === 'helmet' 
                  ? (item.properties?.headZones?.join(", ") || "N/A")
                  : (item.properties?.zones?.join(", ") || "N/A")}
              </span>
            </div>
            {/* Only helmets have deafening stat */}
            {itemType === 'helmet' && (
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Deafening</span>
                <span className={styles.statValue}>{item.properties?.deafening || "None"}</span>
              </div>
            )}
          </div>
        );
      
      case 'headphones':
        return (
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Ambient Volume</span>
              <span className={styles.statValue}>{item.properties?.ambientVolume !== undefined ? `${item.properties.ambientVolume}%` : "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Distance Modifier</span>
              <span className={styles.statValue}>{item.properties?.distanceModifier !== undefined ? `${item.properties.distanceModifier}%` : "N/A"}</span>
            </div>
          </div>
        );
        
      case 'rig':
        return (
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Capacity</span>
              <span className={styles.statValue}>{item.properties?.capacity || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Armor Class</span>
              <span className={styles.statValue}>{item.properties?.class || "No armor"}</span>
            </div>
            {/* Only show protected areas if this rig has armor */}
            {item.properties?.class && (
              <div className={styles.statItem}>
                <span className={styles.statLabel}>Protected Areas</span>
                <span className={styles.statValue}>{item.properties?.zones?.join(", ") || "N/A"}</span>
              </div>
            )}
          </div>
        );
        
      case 'backpack':
        return (
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Capacity</span>
              <span className={styles.statValue}>{item.properties?.capacity || "N/A"}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Grid Size</span>
              <span className={styles.statValue}>
                {/* Display grid dimensions like "10x10, 2x2" if multiple grids */}
                {item.properties?.grids ? 
                  item.properties.grids.map(grid => `${grid.width}x${grid.height}`).join(", ") : 
                  "N/A"}
              </span>
            </div>
          </div>
        );
        
      default:
        return <p>No specific details available for this item type.</p>;
    }
  };
  
  return (
    <div className={styles.detailsContainer}>
      {/* Basic info shown for all item types */}
      <div className={styles.baseStats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Weight</span>
          <span className={styles.statValue}>{item.weight ? `${item.weight} kg` : "Unknown"}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Best Price</span>
          <span className={styles.statValue}>{getBestPrice()}</span>
        </div>
      </div>
      
      {/* Type-specific stats (depends on whether it's a weapon, armor, etc.) */}
      <div className={styles.specificDetails}>
        <h4>Item Stats</h4>
        {renderSpecificDetails()}
      </div>
      
      {/* Where to get the item section */}
      <div className={styles.availabilityInfo}>
        {/* Direct purchase options from traders */}
        {item.buyFor && item.buyFor.some(buy => buy.vendor?.name !== "Flea Market") && (
          <>
            <h4>Purchase Options</h4>
            <ul className={styles.traderList}>
              {item.buyFor
                .filter(purchase => purchase.vendor?.name !== "Flea Market")
                .map((purchase, index) => {
                  // Find what loyalty level is needed for this trader
                  const loyaltyReq = purchase.requirements?.find(req => req.type === "loyaltyLevel");
                  const loyaltyLevel = loyaltyReq ? loyaltyReq.value : 1;
                  
                  return (
                    <li key={`buy-${index}`} className={styles.traderItem}>
                      <span className={styles.traderName}>{purchase.vendor?.name}</span>
                      <span className={styles.traderPrice}>{formatPrice(purchase.price, purchase.currency)}</span>
                      <span className={styles.traderReq}>LL{loyaltyLevel}</span>
                    </li>
                  );
                })}
            </ul>
          </>
        )}
        
        {/* Barter trade options */}
        {item.bartersFor && item.bartersFor.length > 0 && (
          <>
            <h4 className={styles.barterTitle}>Barter Trades</h4>
            <ul className={styles.traderList}>
              {item.bartersFor.map((barter, index) => (
                <li key={`barter-${index}`} className={`${styles.traderItem} ${styles.barterItem}`}>
                  <div className={styles.barterHeader}>
                    <span className={styles.traderName}>{barter.trader?.name}</span>
                    <span className={styles.traderReq}>LL{barter.level}</span>
                  </div>
                  
                  <div className={styles.barterDetails}>
                    <span className={styles.barterLabel}>Required items:</span>
                    <ul className={styles.barterRequirements}>
                      {barter.requiredItems.map((req, reqIndex) => (
                        <li key={reqIndex} className={styles.barterRequirement}>
                          <span className={styles.barterItemCount}>{req.count}x</span> 
                          <span className={styles.barterItemName}>{req.item.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
        
        {/* Message shown if item can't be bought from any trader */}
        {(!item.buyFor || !item.buyFor.some(buy => buy.vendor?.name !== "Flea Market")) && 
         (!item.bartersFor || item.bartersFor.length === 0) && (
          <p className={styles.noOptions}>This item cannot be purchased from traders</p>
        )}
      </div>
    </div>
  );
};

export default ItemDetails;