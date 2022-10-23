"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_core_1 = require("apollo-server-core");
const conversationTypeDef = (0, apollo_server_core_1.gql) `
  type Conversation {
    id: String!
    owner: User!
    participantId: String!
    participants: [Participant!]
    messages: [Message!]!
  }

  type Participant {
    id: String!
    user: User!
    lastSeenDate: String!
  }

  type Message {
    id: String!
    text: String!
    conversationId: String!
    participant: Participant!
    dateSent: String!
  }

  type User {
    userId: String!
    username: String!
    image: String!
  }

  type Query {
    getConversations(userId: String!): [Conversation!]
  }

  type Subscription {
    newMessage(conversationId: String!): Message
  }

  type Mutation {
    createConversation(
      participantUserIds: [String!]
    ): CreateConversationResponse
    lastSeenDate(participantId: String!, conversationId: String!): String
  }

  type CreateConversationResponse {
    success: Boolean
    error: String
  }
`;
exports.default = conversationTypeDef;
