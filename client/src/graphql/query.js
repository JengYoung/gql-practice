import { gql } from "apollo-boost";

const query = gql`
  query listUsers {
    allUsers {
      avatar
      name
    }
  }
`;

export default query;
