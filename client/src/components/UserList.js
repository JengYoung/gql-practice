import React from "react";
import UserListItem from "./UserListItem";

const UserList = ({ count, users, refetchUsers }) => {
  console.log(count);
  return (
    <div>
      <p>
        <strong>{count}</strong> Users
      </p>
      <button onClick={() => refetchUsers()}>Refetching Users</button>
      <ul>
        {users.map((user) => (
          <UserListItem
            key={user.githubLogin}
            name={user.name}
            avatar={user.avatar}
          />
        ))}
      </ul>
    </div>
  );
};

export default UserList;
