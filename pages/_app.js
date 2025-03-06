import { ApolloProvider } from "@apollo/client";
import { ComparisonProvider } from "../context/ComparisonContext";
import client from "../services/api/apolloClient";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <ComparisonProvider>
        <Component {...pageProps} />
      </ComparisonProvider>
    </ApolloProvider>
  );
}

export default MyApp;
