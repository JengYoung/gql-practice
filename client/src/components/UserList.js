import React from "react";
import UserListItem from "./UserListItem";

const UserList = ({ count, users }) => {
  return (
    <div>
      <p>{count} Users</p>
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
