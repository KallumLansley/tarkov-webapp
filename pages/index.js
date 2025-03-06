import { useState } from "react";
import AmmoList from "../components/AmmoList";
import AmmoComparison from "../components/AmmoComparison";
import CaliberGroup from "../components/CaliberGroup";
import styles from "../styles/Home.module.css";

// Organize calibers into groups
const caliberGroups = [
  {
    name: "Shotgun Calibers",
    calibers: ["12 Gauge Shot", "20 Gauge", "23x75mm"]
  },
  {
    name: "Small Calibers",
    calibers: ["9x18mm", "7.62x25mm", "9x19mm", "45 ACP", "9x21mm", "357 Magnum", "5.7x28mm", "4.6x30mm"]
  },
  {
    name: "Medium Calibers",
    calibers: ["9x39mm", "366 TKM", "5.45x39mm", "5.56x45mm", "7.62x39mm", "300 BLK"]
  },
  {
    name: "Large Calibers",
    calibers: ["6.8x51mm", "7.62x51mm", "7.62x54R", "12.7x55mm", "338 Lapua Magnum"]
  }
];

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedGroup, setExpandedGroup] = useState(null);
  
  // Check if search is active to control display
  const isSearchActive = searchTerm.trim().length > 0;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Escape from Tarkov Ammo Data</h1>
      
      <div className={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search for ammo by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </div>
      
      {isSearchActive ? (
        // When searching, render all calibers in a flat list
        <>
          {caliberGroups.flatMap(group => 
            group.calibers.map(caliber => (
              <AmmoList 
                key={caliber.replace(/\./g, "")} 
                caliber={caliber} 
                searchTerm={searchTerm}
              />
            ))
          )}
        </>
      ) : (
        // When not searching, render grouped calibers
        <>
          {caliberGroups.map((group, index) => (
            <CaliberGroup 
              key={group.name} 
              name={group.name} 
              calibers={group.calibers} 
              isExpanded={expandedGroup === index}
              onToggle={() => setExpandedGroup(expandedGroup === index ? null : index)}
            />
          ))}
        </>
      )}

      <AmmoComparison />
    </div>
  );
}

