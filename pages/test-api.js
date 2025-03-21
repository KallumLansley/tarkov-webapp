// pages/test-api.js
import { useQuery, gql } from "@apollo/client";

const TEST_ITEMS_QUERY = gql`
  query {
    items(limit: 10) {
      id
      name
      types
      properties {
        ... on ItemPropertiesArmor {
          class
        }
      }
    }
  }
`;

export default function TestAPI() {
  const { data, loading, error } = useQuery(TEST_ITEMS_QUERY);
  
  return (
    <div style={{ padding: '20px', color: 'white', backgroundColor: '#222', minHeight: '100vh' }}>
      <h1>Simple API Test</h1>
      
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {data && (
        <pre style={{ whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: '80vh' }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}