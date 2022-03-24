import React, { useEffect } from "react";

// import { request } from "graphql-request";

// import query from "./graphql/query";
// import mutation from "./graphql/mutation";
import { gql } from "apollo-boost";
import { BrowserRouter } from "react-router-dom";

import Users from "./components/Users";
import AuthorizedUserButton from "./components/AuthorizedUserButton";

import client from "./graphql/client";

function App() {
  const API_END_POINT = process.env.REACT_APP_API_END_POINT;
  console.log(API_END_POINT);

  // const [users, setUsers] = useState([]);

  // const addUser = () => {
  //   console.log("hi!");
  //   request(API_END_POINT, mutation, { count: 1 }).then((res) => {});
  //   request(API_END_POINT, query).then(({ allUsers = [] }) => {
  //     setUsers(() => allUsers);
  //   });
  // };

  useEffect(() => {
    async function testFetch() {
      try {
        console.log("before cache: ", client.extract());
        const res = await client.query({
          query: gql`
            {
              totalUsers
              totalPhotos
            }
          `,
        });
        console.log("res: ", res);
        console.log("after cache: ", client.extract());
      } catch (e) {
        console.log("error: ", e);
      }
    }
    testFetch();
  }, []);

  return (
    <BrowserRouter>
      <>
        <AuthorizedUserButton />
        <Users></Users>
      </>
    </BrowserRouter>
  );
}

export default App;
