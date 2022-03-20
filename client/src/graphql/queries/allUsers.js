import { gql } from "apollo-boost";

const allUsers = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`;

export default allUsers;
