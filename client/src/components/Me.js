import React from "react";
import { Query } from "react-apollo";
import allUsers from "../graphql/queries/allUsers";
import CurrentUser from "./CurrentUser";

const Me = ({ logout, requestCode, signingIn }) => {
  console.log("ME rerendering!");
  return (
    <Query query={allUsers}>
      {({ loading, data }) => {
        console.log("Me data: ", data);
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
