import React from "react";
import { Query } from "react-apollo";
import allUsers from "../graphql/queries/allUsers";
import UserList from "./UserList";

const Users = () => {
  return (
    <Query query={allUsers} pollInterval={10000}>
      {({ data, loading, refetch }) => (
        <>
          <p>
            <strong>User Loading...</strong> {loading ? "🔥" : "🌈"}
          </p>
          {!loading && (
            <UserList
              count={data.totalUsers}
              users={data.allUsers}
              refetchUsers={refetch}
            />
          )}
        </>
      )}
    </Query>
  );
};

export default Users;
