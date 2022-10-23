import { gql } from 'apollo-server-core';

export const taskTypeDefs = gql`
  type Task {
    id: String!
    title: String!
    taskListId: String!
    dateCreated: String!
  }

  type TaskList {
    id: String!
    title: String!
    conversationID: String!
    dateCreated: String!
    tasks: [Task!]!
  }

  type Query {
    getTaskLists(conversationId: String!): [TaskList!]
  }

  type GetTaskListResponse {
    taskLists: [TaskList!]
    error: String
  }
  input TaskListReorderInput {
    id: String!
    index: Int!
  }

  input TasksReorderInput {
    id: String!
    index: Int!
  }

  type Mutation {
    createTask(taskListId: String!, title: String!): MutationResponse!
    createTaskList(conversationId: String!, title: String!): MutationResponse!
    createTaskDescription(taskId: String!, text: String!): MutationResponse!
    reorderTaskLists(
      conversationId: String!
      taskLists: [TaskListReorderInput!]
    ): MutationResponse!
    reorderTasks(
      taskListId: String!
      tasks: [TasksReorderInput!]
    ): MutationResponse!
  }

  type MutationResponse {
    success: Boolean
    error: String
  }
`;

export default taskTypeDefs;
