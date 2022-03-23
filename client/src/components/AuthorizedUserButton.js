import React, { useEffect, useState, useRef } from "react";
import { Mutation } from "react-apollo";
import { useNavigate } from "react-router-dom";
import MUTATION_GITHUB_AUTH from "../graphql/mutations/MUTATION_GITHUB_AUTH";
import allUsers from "../graphql/queries/allUsers";
import Me from "./Me";

const AuthorizedUserButton = () => {
  const [state, setState] = useState({
    signingIn: false,
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
      setState((state) => ({ signingIn: false }));
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
            logout={() => localStorage.removeItem("token")}
          />
        );
      }}
    </Mutation>
  );
};

export default AuthorizedUserButton;
