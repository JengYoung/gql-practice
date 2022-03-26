import { persistCache } from "apollo-cache-persist";

import ApolloClient, {
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split,
} from "apollo-boost";

// import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";

const httpLink = new HttpLink({ url: "http://localhost:4000/graphql" });
// const wsLink = new WebSocketLink({
//   url: "ws://localhost:4000/graphql",
//   options: { reconnect: true },
// });

const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:4000/graphql",
  })
);

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext((context) => ({
    headers: {
      ...context.headers,
      authorization: localStorage.getItem("token"),
    },
  }));
  return forward(operation);
});

const httpAuthLink = authLink.concat(httpLink);

const link = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpAuthLink
);

export const cache = new InMemoryCache();

persistCache({
  cache,
  storage: localStorage,
});

const client = new ApolloClient({
  cache,
  link,
  // url: process.env.REACT_APP_API_END_POINT,
  // request: (operation) => {
  //   operation.setContext((context) => ({
  //     headers: {
  //       ...context.headers,
  //       authorization: localStorage.getItem("token"),
  //     },
  //   }));
  // },
});

export default client;
