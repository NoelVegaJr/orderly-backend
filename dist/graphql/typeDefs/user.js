"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userTypeDef = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.userTypeDef = (0, apollo_server_core_1.gql) `
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
exports.default = exports.userTypeDef;
