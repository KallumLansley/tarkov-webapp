// components/ItemList.js
import { useState } from "react";
import { useQuery } from "@apollo/client";
import { useLoadout } from "../context/LoadoutContext";
import ItemDetails from "./ItemDetails";
import styles from "./ItemList.module.css";

// ItemList displays a filterable, searchable list of items for a gear category
// This implements the second level of progressive disclosure in the loadout page
const ItemList = ({ itemType, query, selectedItem, onItemSelect }) => {
  // Track which item's details are currently expanded
  const [expandedItem, setExpandedItem] = useState(null);
  // Track how the list is currently sorted (price, weight, etc.)
  const [filterType, setFilterType] = useState(null);
  // Track what the user is searching for
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get the function to check if items are available at current trader levels
  const { isItemAvailable } = useLoadout();
  
  // Fetch data from the API using the provided GraphQL query
  const { loading, error, data } = useQuery(query);
  
  // Show loading and error states
  if (loading) return <p>Loading items...</p>;
  if (error) return <p>Error loading items: {error.message}</p>;
  
  // Get the items array from the data, or use empty array if none found
  const items = data?.items || [];
  
  // Filter items based on search and trader availability, then sort them
  const filteredItems = items
    .filter(item => {
      // Filter out items that don't match the search term
      if (searchTerm && !item.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filter out items not available at current trader levels
      return isItemAvailable(item);
    })
    .sort((a, b) => {
      // Don't sort if no sort type is selected
      if (!filterType) return 0;
      
      if (filterType === 'price') {
        // Helper function to get the lowest trader price for an item
        const getLowestTraderPrice = (item) => {
          // Filter out Flea Market prices
          const traderPrices = item.buyFor?.filter(p => p.vendor?.name !== "Flea Market") || [];
          return traderPrices.length ? Math.min(...traderPrices.map(p => p.price)) : Infinity;
        };
        
        // Sort by lowest price first
        const aPrice = getLowestTraderPrice(a);
        const bPrice = getLowestTraderPrice(b);
        return aPrice - bPrice;
      }
      
      if (filterType === 'weight') {
        // Sort by lightest first
        return a.weight - b.weight;
      }
      
      return 0;
    });
  
  // Function to expand or collapse an item's details
  const toggleItemDetails = (itemId) => {
    setExpandedItem(expandedItem === itemId ? null : itemId);
  };
  
  return (
    <div className={styles.itemListContainer}>
      {/* Search and sort controls */}
      <div className={styles.filterControls}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        
        <div className={styles.sortButtons}>
          <span>Sort by: </span>
          <button 
            className={`${styles.sortButton} ${filterType === 'price' ? styles.activeSort : ''}`}
            onClick={() => setFilterType(filterType === 'price' ? null : 'price')}
          >
            Price
          </button>
          <button 
            className={`${styles.sortButton} ${filterType === 'weight' ? styles.activeSort : ''}`}
            onClick={() => setFilterType(filterType === 'weight' ? null : 'weight')}
          >
            Weight
          </button>
        </div>
      </div>
      
      {/* Show message when no items match the filters */}
      {filteredItems.length === 0 ? (
        <div className={styles.noItems}>
          <p>No items available at your current trader levels.</p>
          <p>Try increasing your trader levels to see more options.</p>
        </div>
      ) : (
        // List of filtered items
        <ul className={styles.itemList}>
          {filteredItems.map(item => (
            <li 
              key={item.id} 
              className={`${styles.itemEntry} ${selectedItem?.id === item.id ? styles.itemSelected : ''}`}
            >
              {/* Item header - always visible */}
              <div 
                className={styles.itemHeader}
                onClick={() => toggleItemDetails(item.id)}
              >
                <div className={styles.itemBasicInfo}>
                  {/* Show item image if available */}
                  {item.baseImageLink && (
                    <img 
                      src={item.baseImageLink} 
                      alt={item.name} 
                      className={styles.itemImage}
                    />
                  )}
                  <span className={styles.itemName}>{item.name}</span>
                </div>
                
                <div className={styles.itemControls}>
                  {/* Button to select/unselect this item for the loadout */}
                  <button 
                    className={`${styles.selectButton} ${selectedItem?.id === item.id ? styles.selectedButton : ''}`}
                    onClick={(e) => {
                      // Stop click from bubbling up to parent (would toggle details)
                      e.stopPropagation();
                      // If already selected, unselect it, otherwise select it
                      onItemSelect(selectedItem?.id === item.id ? null : item);
                    }}
                  >
                    {selectedItem?.id === item.id ? 'Unselect' : 'Select'}
                  </button>
                  {/* Arrow indicator for expanded/collapsed state */}
                  <span className={styles.toggleIndicator}>{expandedItem === item.id ? '▼' : '►'}</span>
                </div>
              </div>
              
              {/* Item details - third level of progressive disclosure, only shown when expanded */}
              {expandedItem === item.id && (
                <ItemDetails item={item} itemType={itemType} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ItemList;