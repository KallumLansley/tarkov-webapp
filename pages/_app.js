import { ApolloProvider } from "@apollo/client";
import client from "../services/api/apolloClient";

function MyApp({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;
