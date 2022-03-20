import React from "react";

const UserListItem = ({ name, avatar }) => {
  return (
    <li>
      <img src={avatar} width={48} height={48} alt="" />
      {name}
    </li>
  );
};

export default UserListItem;
