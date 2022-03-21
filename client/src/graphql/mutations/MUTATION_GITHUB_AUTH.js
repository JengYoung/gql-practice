import { gql } from "apollo-boost";

const MUTATION_GITHUB_AUTH = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`;

export default MUTATION_GITHUB_AUTH;
