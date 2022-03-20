import React, { useEffect, useState } from "react";
/* eslint-disable-next-line */
import { request } from "graphql-request";

import query from "./graphql/query";
import mutation from "./graphql/mutation";
import client from "./graphql/client";
import { gql } from "apollo-boost";

function App() {
  const API_END_POINT = process.env.REACT_APP_API_END_POINT;
  console.log(API_END_POINT);

  const [users, setUsers] = useState([]);

  const addUser = () => {
    console.log("hi!");
    request(API_END_POINT, mutation, { count: 1 }).then((res) => {});
    request(API_END_POINT, query).then(({ allUsers = [] }) => {
      setUsers(() => allUsers);
    });
  };

  useEffect(() => {
    async function testFetch() {
      try {
        const res = await client.query({
          query: gql`
            {
              totalUsers
              totalPhotos
            }
          `,
        });
        console.log("res: ", res);
      } catch (e) {
        console.log("error: ", e);
      }
    }
    testFetch();
  });

  useEffect(() => {
    addUser();

    return () => setUsers(() => []);
  }, []);

  return (
    <div>
      {users.map((user, index) => (
        <div key={`${user.githubLogin}${index}`}>
          <img src={user.avatar} alt="image" />
          {user.name}
        </div>
      ))}
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

export default App;
