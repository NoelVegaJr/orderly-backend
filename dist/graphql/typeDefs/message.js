"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.messageTypeDefs = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.messageTypeDefs = (0, apollo_server_core_1.gql) `
  type Query {
    getMessages(conversationId: String!): [Message!]!
  }

  type Message {
    id: String!
    text: String!
    conversationId: String!
    participant: Participant!
    dateSent: String!
  }

  type Participant {
    id: String!
    user: User!
    messages: [Message!]
  }

  type User {
    id: String!
    username: String!
    image: String
  }

  type Mutation {
    createMessage(
      conversationId: String!
      text: String!
      participantId: String!
    ): CreateMessageResponse

    newMessage(
      conversationId: String!
      text: String!
      participantId: String!
    ): CreateMessageResponse
  }

  type CreateMessageResponse {
    success: Boolean
    error: String
  }

  type Subscription {
    msg2(conversationIds: [String!]): Message!
  }
`;
exports.default = exports.messageTypeDefs;
