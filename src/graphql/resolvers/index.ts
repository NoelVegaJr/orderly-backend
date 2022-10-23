import merge from 'lodash.merge';
import userResolvers from './user';
import conversationResolvers from './conversation';
import messageResolvers from './message';
import taskResolvers from './task';
export const resolvers = merge(
  {},
  userResolvers,
  conversationResolvers,
  messageResolvers,
  taskResolvers
);
export default resolvers;
