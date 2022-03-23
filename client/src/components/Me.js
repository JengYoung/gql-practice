import React from "react";
import { Query } from "react-apollo";
import allUsers from "../graphql/queries/allUsers";
import CurrentUser from "./CurrentUser";

const Me = ({ logout, requestCode, signingIn }) => {
  return (
    <Query query={allUsers}>
      {({ loading, data }) => {
        return data?.me ? (
          <CurrentUser {...data.me} logout={logout} />
        ) : loading ? (
          <p>loading...</p>
        ) : (
          <button onClick={requestCode} disabled={signingIn}>
            Sign In With GitHub
          </button>
        );
      }}
    </Query>
  );
};

export default Me;
