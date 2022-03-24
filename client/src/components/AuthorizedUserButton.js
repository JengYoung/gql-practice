import React, { useEffect, useState, useRef } from "react";
import { Mutation, withApollo } from "react-apollo";
// import { flowRight as compose } from "lodash";

import { useNavigate } from "react-router-dom";
import MUTATION_GITHUB_AUTH from "../graphql/mutations/MUTATION_GITHUB_AUTH";
import allUsers from "../graphql/queries/allUsers";
import Me from "./Me";

const AuthorizedUserButton = ({ client }) => {
  const [state, setState] = useState({
    signingIn: false,
    data: client.readQuery({ query: allUsers }) ?? null,
  });
  const githubAuthMutation = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setState((state) => ({ ...state, signingIn: true }));
      const code = window.location.search.replace("?code=", "");
      alert(code);

      githubAuthMutation.current({ variables: { code } });

      navigate("/", { replace: true });
    }

    return () => {
      setState((state) => ({ ...state, signingIn: false }));
      githubAuthMutation.current = null;
    };
  }, []);

  const requestCode = () => {
    const clientID = process.env.REACT_APP_CLIENT_ID;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  };

  const authorizationComplete = (cache, { data }) => {
    localStorage.setItem("token", data.githubAuth.token);
    navigate("/", { replace: true });
    setState((state) => ({ ...state, signingIn: false }));
  };

  const onLogout = () => {
    console.log("logout!");
    localStorage.removeItem("token");

    const data = client.readQuery({ query: allUsers });
    setState((state) => ({
      ...state,
      data: {
        ...data,
        me: null,
      },
    }));

    client.writeQuery({ query: allUsers, data: state.data });
  };

  useEffect(() => {
    if (!state.data?.me) return;
    if (state.data.me === null) {
      setState((state) => ({ ...state, signingIn: false }));
    }
  }, [state.data]);

  return (
    <Mutation
      mutation={MUTATION_GITHUB_AUTH}
      update={authorizationComplete}
      refetchQueries={[{ query: allUsers }]}
    >
      {(mutation) => {
        githubAuthMutation.current = mutation;

        // return (
        //   <button onClick={requestCode} disabled={state.signingIn}>
        //     Sign In with GitHub
        //   </button>
        // );
        return (
          <Me
            signingIn={state.signingIn}
            requestCode={requestCode}
            logout={() => onLogout()}
          />
        );
      }}
    </Mutation>
  );
};

// if you wanna set series of HOC patterns, then you can use lodash's flowRight(as compose)
export default withApollo(AuthorizedUserButton);
