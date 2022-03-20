import { gql } from "apollo-boost";

const mutation = gql`
  mutation populate($count: Int!) {
    addFakeUsers(count: $count) {
      githubLogin
    }
  }
`;

export default mutation;
