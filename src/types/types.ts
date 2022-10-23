import { PrismaClient } from '@prisma/client';
import { ApolloError } from 'apollo-server-core';
import { PubSub } from 'graphql-subscriptions';
import { Context } from 'graphql-ws/lib/server';

export interface CreateUsernameResponse {
  success?: boolean;
  error?: string;
}

export interface CreateConversationResponse {
  success?: boolean;
  error?: string;
}

export interface SearchUsernameResponse {
  users?: Array<SearchedUser> | ApolloError | null;
  error?: ApolloError;
}

export interface SearchedUser {
  id: string;
  username: string;
}

export interface GraphQLContext {
  session: Session | null;
  prisma: PrismaClient;
  pubsub: PubSub;
}

export interface SubscriptionContext extends Context {
  connectionParams: {
    session?: Session;
  };
}

export interface Session {
  user?: User;
}

export interface User {
  id: string;
  name?: string | null;
  username: string;
  email?: string | null;
  image?: string | null;
}

// Task

export interface Task {
  id: string;
  title: string;
  taskListId: string;
  dateCreated: Date;
}

export interface TaskList {
  id: string;
  title: string;
  conversationId: string;
  dateCreated: Date;
  tasks: Task[];
}

export interface GetTaskListsVariables {
  conversationId: string;
}

export interface GetTaskListsResponse {
  taskLists?: TaskList[];
  error?: string;
}

export interface MutationResponse {
  success?: boolean;
  error?: string;
}

export interface CreateTaskVariables {
  taskListId: string;
  title: string;
}

export interface CreateTaskVariables {
  conversationId: string;
  title: string;
}
