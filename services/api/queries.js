// this is quering items(name: $ammoName), which fetches details for a specific ammo type. it will retrieve the name, damage, penetration, buyfor (price, currenct, and source)
	// the ... on ItemPropertiesAmmo ensures it specifically fetches ammo-specific properties.
import { gql } from "@apollo/client";

export const GET_ALL_AMMO = gql`
  query GetAllAmmo {
    items {
      id
      name
      shortName
      properties {
        ... on ItemPropertiesAmmo {
          tracer
          tracerColor
          damage
          armorDamage
          fragmentationChance
          ricochetChance
          penetrationChance
          penetrationPower
          accuracyModifier
          recoilModifier
          initialSpeed
          lightBleedModifier
          heavyBleedModifier
          caliber
        }
      }
      buyFor {
        price
        currency
        source
        vendor {
          name
        }
      }
    }
  }
`;

export const GET_ALL_ITEMS = gql`
  query GetAllItems {
    items {
      id
      name
      baseImageLink
      types  # Retrieves the item's category
      properties {
        ... on ItemPropertiesWeapon {
          caliber
        }
      }
    }
  }
`;

