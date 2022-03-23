import ApolloClient from "apollo-boost";

const client = new ApolloClient({
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
