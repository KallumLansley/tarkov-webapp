// services/api/loadoutQueries.js
import { gql } from "@apollo/client";
// GraphQL query for weapons
// Gets all guns with their stats and price information
export const GET_WEAPONS = gql`
  query GetWeapons {
    items(types: gun) {
      id
      name
      shortName
      baseImageLink
      properties {
        ... on ItemPropertiesWeapon {
          caliber
          fireRate
          ergonomics
          recoilVertical
          recoilHorizontal
        }
      }
      buyFor {
        price
        currency
        vendor {
          name
        }
        requirements {
          type
          value
        }
      }
      bartersFor {
        trader {
          name
        }
        level
        requiredItems {
          item {
            id
            name
          }
          count
        }
      }
      weight
      types
    }
  }
`;
// GraphQL query for body armor
// Gets armor vests that protect the torso
export const GET_ARMOR = gql`
  query GetArmor {
    items(types: armor) {
      id
      name
      shortName
      baseImageLink
      properties {
        ... on ItemPropertiesArmor {
          class
          durability
          material {
            name
          }
          zones
          repairCost
          speedPenalty
          turnPenalty
        }
      }
      buyFor {
        price
        currency
        vendor {
          name
        }
        requirements {
          type
          value
        }
      }
      bartersFor {
        trader {
          name
        }
        level
        requiredItems {
          item {
            id
            name
          }
          count
        }
      }
      weight
    }
  }
`;

// GraphQL query for helmets
// Gets head protection gear
export const GET_HELMETS = gql`
  query GetHelmets {
    items(types: helmet) {
      id
      name
      shortName
      baseImageLink
      properties {
        ... on ItemPropertiesHelmet {
          class
          durability
          material {
            name
          }
          headZones
          repairCost
          speedPenalty
          turnPenalty
          deafening
        }
      }
      buyFor {
        price
        currency
        vendor {
          name
        }
        requirements {
          type
          value
        }
      }
      bartersFor {
        trader {
          name
        }
        level
        requiredItems {
          item {
            id
            name
          }
          count
        }
      }
      weight
    }
  }
`;

// GraphQL query for tactical rigs
// Gets chest rigs for ammo and item storage
export const GET_RIGS = gql`
  query GetRigs {
    items(types: rig) {
      id
      name
      shortName
      baseImageLink
      properties {
        ... on ItemPropertiesChestRig {
          class
          capacity
          zones
        }
      }
      buyFor {
        price
        currency
        vendor {
          name
        }
        requirements {
          type
          value
        }
      }
      bartersFor {
        trader {
          name
        }
        level
        requiredItems {
          item {
            id
            name
          }
          count
        }
      }
      weight
    }
  }
`;
// GraphQL query for backpacks
// Gets storage bags for loot
export const GET_BACKPACKS = gql`
  query GetBackpacks {
    items(types: backpack) {
      id
      name
      shortName
      baseImageLink
      properties {
        ... on ItemPropertiesBackpack {
          capacity
          grids {
            width
            height
          }
        }
      }
      buyFor {
        price
        currency
        vendor {
          name
        }
        requirements {
          type
          value
        }
      }
      bartersFor {
        trader {
          name
        }
        level
        requiredItems {
          item {
            id
            name
          }
          count
        }
      }
      weight
    }
  }
`;

// GraphQL query for headphones/headsets
// Gets tactical hearing devices
export const GET_HEADPHONES = gql`
  query GetHeadphones {
    items(types: headphones) {
      id
      name
      shortName
      baseImageLink
      properties {
        ... on ItemPropertiesHeadphone {
          ambientVolume
          distanceModifier
        }
      }
      buyFor {
        price
        currency
        vendor {
          name
        }
        requirements {
          type
          value
        }
      }
      bartersFor {
        trader {
          name
        }
        level
        requiredItems {
          item {
            id
            name
          }
          count
        }
      }
      weight
    }
  }
`;