import React, { useEffect, useState } from "react";
/* eslint-disable-next-line */
import { request } from "graphql-request";

function App() {
  const API_END_POINT = process.env.REACT_APP_API_END_POINT;
  console.log(API_END_POINT);

  const query = `
  query listUsers {
    allUsers {
      avatar
      name
    }
  }
`;

  const mutation = `
  mutation populate($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
    }
  }
`;

  const [users, setUsers] = useState([]);

  const addUser = () => {
    console.log("hi!");
    request(API_END_POINT, mutation, { count: 1 }).then((res) => {});
    request(API_END_POINT, query).then(({ allUsers = [] }) => {
      setUsers(() => allUsers);
    });
  };

  useEffect(() => {
    addUser();

    return () => setUsers(() => []);
  }, []);

  return (
    <div>
      {users.map((user) => (
        <div key={user.githubLogin}>
          <img src={user.avatar} alt="image" />
          {user.name}
        </div>
      ))}
      <button onClick={addUser}>Add User</button>
    </div>
  );
}

export default App;
