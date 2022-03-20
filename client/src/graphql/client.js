import ApolloClient from "apollo-boost";

const client = new ApolloClient({
  url: process.env.REACT_APP_API_END_POINT,
});

export default client;
