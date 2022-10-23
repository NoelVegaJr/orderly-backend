import {
  CreateUsernameResponse,
  GraphQLContext,
  SearchUsernameResponse,
} from '../../types/types';

import { ApolloError } from 'apollo-server-core';
import { User } from '@prisma/client';

export const userResolvers = {
  Query: {
    searchUsers: async (
      _: any,
      args: { searchedUsername: string },
      ctx: GraphQLContext
    ): Promise<Array<User> | ApolloError> => {
      const { searchedUsername } = args;
      const { session, prisma } = ctx;
      console.log(session);
      if (!session?.user) {
        console.log('no user found');
        return new ApolloError('Not authorized');
      }

      const {
        user: { username: myUsername },
      } = session;

      try {
        const users = await prisma.user.findMany({
          where: {
            username: {
              contains: searchedUsername,
              not: myUsername,
            },
          },
        });
        console.log(users);
        console.log('Searched Users: ', searchedUsername, users);
        return users;
      } catch (error: any) {
        console.log('searchUsers error', error);
        throw new ApolloError(error?.message);
      }
    },
  },
  Mutation: {
    createUsername: async (
      _: any,
      args: { username: string; id: string },
      ctx: GraphQLContext
    ): Promise<CreateUsernameResponse> => {
      console.log('hello');
      const { username, id } = args;
      const { session, prisma } = ctx;

      /*console.log(session);
      if (!session?.user) {
        return { error: 'Not authorized' };
      }*/

      try {
        const existingUsername = await prisma.user.findFirst({
          where: {
            username: username,
          },
        });
        if (existingUsername) {
          console.log('username exists');
          return { error: 'This username already exists' };
        }

        await ctx.prisma.user.update({
          where: {
            id: id,
          },
          data: {
            username,
          },
        });

        return { success: true };
      } catch (error: any) {
        console.log(error);
        return { error: error.message };
      }
    },
    createNewMessage: (_: any, args: { text: string }, ctx: GraphQLContext) => {
      console.log(args.text);
      ctx.pubsub.publish('NewMessage', {
        msg: args.text,
      });
      return args.text;
    },
  },
  Subscription: {
    msg: {
      subscribe: (parent: any, __: any, context: GraphQLContext) => {
        // console.log(context);
        const { pubsub } = context;
        return pubsub.asyncIterator(['NewMessage']);
      },
    },
  },
};
export default userResolvers;
