// pages/loadout.js
import { useLoadout } from "../context/LoadoutContext";
import UserProfile from "../components/UserProfile";
import GearCategory from "../components/GearCategory";
import LoadoutSummary from "../components/LoadoutSummary";
import LoadoutGuide from "../components/LoadoutGuide";
import LoadoutFooter from "../components/LoadoutFooter";
import Link from "next/link";
import {
  GET_WEAPONS,
  GET_ARMOR,
  GET_HELMETS,
  GET_RIGS,
  GET_BACKPACKS,
  GET_HEADPHONES
} from "../services/api/loadoutQueries";
import styles from "../styles/Loadout.module.css";

// Main loadout page component
// This is where users can build their Tarkov kit based on what traders they have unlocked
export default function Loadout() {
  // Get the current loadout and the function to update it from our context
  const { selectedLoadout, updateLoadoutItem } = useLoadout();
  
  return (
    <div className={styles.container}>
      {/* Link to go back to the ammo guide page */}
      <div className={styles.navigation}>
        <Link href="/">
          <span className={styles.navLink}>← Back to Ammo Guide</span>
        </Link>
      </div>
      
      <h1 className={styles.title}>Escape from Tarkov Loadout Builder</h1>
      
      {/* Guide for using the loadout builder - starts collapsed */}
      <LoadoutGuide />
      
      {/* This lets users set their trader levels, which filters what gear is available */}
      <UserProfile />
      
      {/* Shows what gear is currently selected and the total cost */}
      <LoadoutSummary />
      
      {/* All our gear categories are in here */}
      <div className={styles.categoriesContainer}>
        {/* Each category starts collapsed and opens when clicked
            This helps reduce information overload for the user */}
        
        {/* Weapons category */}
        <GearCategory
          title="Weapons"
          icon="🔫"
          description="Select your primary weapon"
          itemType="weapon"
          query={GET_WEAPONS} // Gets the weapon data from the API
          selectedItem={selectedLoadout.weapon} // The currently chosen weapon (if any)
          onItemSelect={(type, item) => updateLoadoutItem('weapon', item)} // What happens when a weapon is selected
        />
        
        {/* Helmets category */}
        <GearCategory
          title="Helmets"
          icon="🪖"
          description="Select your head protection"
          itemType="helmet"
          query={GET_HELMETS}
          selectedItem={selectedLoadout.helmet}
          onItemSelect={(type, item) => updateLoadoutItem('helmet', item)}
        />
        
        {/* Headphones category */}
        <GearCategory
          title="Headphones"
          icon="🎧"
          description="Select your tactical headset for enhanced audio"
          itemType="headphones"
          query={GET_HEADPHONES}
          selectedItem={selectedLoadout.headphones}
          onItemSelect={(type, item) => updateLoadoutItem('headphones', item)}
        />
        
        {/* Body armor category */}
        <GearCategory
          title="Body Armor"
          icon="🛡️"
          description="Select your body protection"
          itemType="armor"
          query={GET_ARMOR}
          selectedItem={selectedLoadout.armor}
          onItemSelect={(type, item) => updateLoadoutItem('armor', item)}
        />
        
        {/* Tactical rigs category */}
        <GearCategory
          title="Tactical Rigs"
          icon="🦺"
          description="Select your tactical rig for extra storage and protection"
          itemType="rig"
          query={GET_RIGS}
          selectedItem={selectedLoadout.rig}
          onItemSelect={(type, item) => updateLoadoutItem('rig', item)}
        />
        
        {/* Backpacks category */}
        <GearCategory
          title="Backpacks"
          icon="🎒"
          description="Select your backpack for additional storage"
          itemType="backpack"
          query={GET_BACKPACKS}
          selectedItem={selectedLoadout.backpack}
          onItemSelect={(type, item) => updateLoadoutItem('backpack', item)}
        />
      </div>
      
      {/* Custom footer for the loadout page with relevant information */}
      <LoadoutFooter />
    </div>
  );
}