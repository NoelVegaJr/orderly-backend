import { gql } from 'apollo-server-core';
import { GraphQLScalarType, Kind } from 'graphql';

export const messageTypeDefs = gql`
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

export default messageTypeDefs;
