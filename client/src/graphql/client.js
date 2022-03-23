import ApolloClient, { InMemoryCache } from "apollo-boost";
import { persistCache } from "apollo-cache-persist";

export const cache = new InMemoryCache();
persistCache({
  cache,
  storage: localStorage,
});

const client = new ApolloClient({
  cache,
  url: process.env.REACT_APP_API_END_POINT,
  request: (operation) => {
    operation.setContext((context) => ({
      headers: {
        ...context.headers,
        authorization: localStorage.getItem("token"),
      },
    }));
  },
});

export default client;
