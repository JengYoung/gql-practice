import React from "react";

const CurrentUser = ({ name, avatar, logout }) => {
  return (
    <div>
      <img src={avatar} width={48} height={48} alt="" />
      <h1>{name}</h1>
      <button onClick={logout}>logout</button>
    </div>
  );
};

export default CurrentUser;
