import { gql } from "apollo-boost";

const addFakeUsers = gql`
  mutation addFakeUsers($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
      name
      avatar
    }
  }
`;

export default addFakeUsers;
