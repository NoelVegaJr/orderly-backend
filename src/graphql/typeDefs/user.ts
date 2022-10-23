import { gql } from 'apollo-server-core';

export const userTypeDef = gql`
  type SearchedUser {
    id: String
    username: String
    image: String
  }

  type Query {
    searchUsers(searchedUsername: String!): [SearchedUser]
    currentNumber: Int
  }

  type Subscription {
    msg: String
  }

  type Mutation {
    createUsername(username: String): CreateUsernameResponse!
    createNewMessage(text: String): String
  }

  type CurrentNumber {
    number: Int
  }

  type CreateUsernameResponse {
    success: Boolean
    error: String
  }
`;

export default userTypeDef;
