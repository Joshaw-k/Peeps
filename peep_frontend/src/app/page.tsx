"use client";

import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import App from "./App";
import "./globals.css";

//Setup GraphQL Apollo client
const URL_QUERY_GRAPHQL = "http://localhost:8080/graphql";

const client = new ApolloClient({
  uri: URL_QUERY_GRAPHQL,
  cache: new InMemoryCache(),
});

export default function Home() {
  return (
    <main>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </main>
  );
}
