import { gql } from "apollo-boost";

const totalFields = gql`
  {
    totalUsers
    totalPhotos
  }
`;

export default totalFields;
