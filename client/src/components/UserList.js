import React from "react";
import { Mutation } from "react-apollo";
import addFakeUsers from "../graphql/mutations/addFakeUsers";
import allUsers from "../graphql/queries/allUsers";
import UserListItem from "./UserListItem";

const UserList = ({ count, users, refetchUsers }) => {
  console.log(count);
  return (
    <div>
      <p>
        <strong>{count}</strong> Users
      </p>

      <button onClick={() => refetchUsers()}>Refetching Users</button>
      {/* refetchQueries: 만약 뮤테이션 요청이 완료되면 불러오는 쿼리를 설정함 */}

      <Mutation
        mutation={addFakeUsers}
        variables={{ count: 1 }}
        refetchQueries={[{ query: allUsers }]}
      >
        {(addFakeUsers) => (
          <button onClick={addFakeUsers}>임시 사용자 추가</button>
        )}
      </Mutation>

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
