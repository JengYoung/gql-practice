import React from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { ApolloProvider } from "react-apollo";

import reportWebVitals from "./reportWebVitals";

import client, { cache } from "./graphql/client";

// import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
// import { createClient } from "graphql-ws";

if (localStorage["apollo-cache-persist"]) {
  const cacheData = JSON.parse(localStorage["apollo-cache-persist"]);
  cache.restore(cacheData);
}

// const wsLink = new GraphQLWsLink(
//   createClient({
//     url: "ws://localhost:4000/graphql",
//   })
// );

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
