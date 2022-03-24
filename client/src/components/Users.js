import React from "react";
import { Query } from "react-apollo";
import allUsers from "../graphql/queries/allUsers";
import UserList from "./UserList";

const Users = () => {
  return (
    /* 
      pollInterval - 폴링을 계속해서 (인자)초마다 하도록 함. 
      이를 제어하는 `stopPolling` `startPolling` `fetchMore(다음 페이지 데이터 가져오는 함수)` 등을 추가로 제공한다. 
    */
    <Query query={allUsers} fetchPolicy="cache-and-network">
      {({ data, loading, refetch }) => {
        return (
          <>
            <p>
              <strong>User Loading...</strong> {loading ? "🔥" : "finished 🌈"}
            </p>
            {!loading && (
              <UserList
                count={data.totalUsers}
                users={data.allUsers}
                refetchUsers={refetch}
              />
            )}
          </>
        );
      }}
    </Query>
  );
};

export default Users;
