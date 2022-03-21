import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthorizedUserButton = () => {
  const [state, setState] = useState({ signingIn: false });
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.search.match(/code=/)) {
      setState({ signingIn: true });
      const code = window.location.search.replace("?code=", "");
      alert(code);

      navigate("/", { replace: true });
    }
  });

  const requestCode = () => {
    const clientID = process.env.REACT_APP_CLIENT_ID;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientID}&scope=user`;
  };

  return (
    <button onClick={requestCode} disabled={state.signingIn}>
      Login by GitHub
    </button>
  );
};

export default AuthorizedUserButton;
