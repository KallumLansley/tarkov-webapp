// pages/api-test.js
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

// Test query for armour items with barter info
const BARTER_TEST_QUERY = gql`
  query {
    items(limit: 15, types: [armor, helmet, rig, backpack]) {
      id
      name
      shortName
      types
      buyFor {
        vendor {
          name
        }
        price
        currency
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
    }
  }
`;

export default function APITest() {
  const [showBarterData, setShowBarterData] = useState(true);
  
  const { data: barterData, loading: barterLoading, error: barterError } = useQuery(BARTER_TEST_QUERY);
  
  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#222', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1>Tarkov API Test Page</h1>
      
      <h2>Armor & Equipment Barter Data</h2>
      {barterLoading && <p>Loading barter data...</p>}
      {barterError && <p>Error: {barterError.message}</p>}
      {barterData && (
        <div>
          <p>Found {barterData.items.length} items</p>
          
          {barterData.items.map(item => (
            <div key={item.id} style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              backgroundColor: '#333', 
              borderRadius: '4px',
              border: item.bartersFor?.length ? '1px solid #f39c12' : '1px solid #666'
            }}>
              <h3 style={{ marginTop: 0 }}>{item.name}</h3>
              <p>Types: {item.types.join(', ')}</p>
              
              <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                  <h4>Buy Options ({item.buyFor?.length || 0})</h4>
                  {item.buyFor?.length > 0 ? (
                    <ul style={{ paddingLeft: '20px' }}>
                      {item.buyFor.map((buy, index) => (
                        <li key={index}>
                          {buy.vendor?.name}: {buy.price} {buy.currency}
                          {buy.requirements?.length > 0 && (
                            <ul>
                              {buy.requirements.map((req, reqIndex) => (
                                <li key={reqIndex}>
                                  {req.type}: {req.value}
                                </li>
                              ))}
                            </ul>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No direct purchase options</p>
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <h4>Barter Options ({item.bartersFor?.length || 0})</h4>
                  {item.bartersFor?.length > 0 ? (
                    <ul style={{ paddingLeft: '20px' }}>
                      {item.bartersFor.map((barter, index) => (
                        <li key={index}>
                          <strong>{barter.trader?.name}</strong> (LL{barter.level})
                          <div>
                            <span>Required items:</span>
                            <ul>
                              {barter.requiredItems?.map((item, itemIndex) => (
                                <li key={itemIndex}>
                                  {item.count}x {item.item.name}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No barter options</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}