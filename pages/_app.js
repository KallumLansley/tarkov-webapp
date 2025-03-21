import { ApolloProvider } from "@apollo/client";
import { ComparisonProvider } from "../context/ComparisonContext";
import { LoadoutProvider } from "../context/LoadoutContext";
import client from "../services/api/apolloClient";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ComparisonProvider>
        <LoadoutProvider>
          <Component {...pageProps} />
        </LoadoutProvider>
      </ComparisonProvider>
    </ApolloProvider>
  );
}

export default MyApp;