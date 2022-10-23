import { withFilter } from 'graphql-subscriptions';
import { GraphQLContext } from '../../types/types';

export const messageResolvers = {
  Query: {
    getMessages: async (
      _: any,
      args: { conversationId: string },
      ctx: GraphQLContext
    ) => {
      const { conversationId } = args;
      const { session, prisma } = ctx;
      console.log('INSIDE GET MESSAGES: ');
      if (!session) {
        return null;
      }

      try {
        const messages = await prisma.message.findMany({
          where: {
            conversationId,
          },
          select: {
            id: true,
            text: true,
            conversationId: true,
            dateSent: true,
            participant: {
              select: {
                id: true,
                user: true,
              },
            },
          },
        });
        console.log('MESSAGES: ', messages);
        return messages;
      } catch (error: any) {
        console.log(error?.message);
      }
    },
  },
  Mutation: {
    createMessage: async (
      _: any,
      args: { conversationId: string; participantId: string; text: string },
      ctx: GraphQLContext
    ) => {
      const { conversationId, participantId, text } = args;
      const { session, prisma } = ctx;
      console.log('INSIDE CREATE MESSAGE: ', conversationId, text);
      if (!session) {
        return { error: 'Not authorized' };
      }
      try {
        const newMessage = await prisma.message.create({
          data: {
            conversationId,
            text,
            dateSent: new Date(),
            participantId: participantId,
          },
        });
        return { success: true };
      } catch (error: any) {
        return { error: error?.message };
      }
    },
    newMessage: async (
      _: any,
      args: { conversationId: string; participantId: string; text: string },
      ctx: GraphQLContext
    ) => {
      const { conversationId, participantId, text } = args;
      const { session, prisma } = ctx;
      console.log('INSIDE CREATE MESSAGE: ', conversationId, text);
      if (!session) {
        return { error: 'Not authorized' };
      }
      try {
        const newMessage = await prisma.message.create({
          data: {
            conversationId,
            text,
            dateSent: new Date(),
            participantId: participantId,
          },
        });
        const message = await prisma.message.findUnique({
          where: {
            id: newMessage.id,
          },
          select: {
            id: true,
            text: true,
            conversationId: true,
            dateSent: true,
            participant: {
              select: {
                id: true,
                user: true,
              },
            },
          },
        });
        // console.log('sending message to pubsub: ', message);
        ctx.pubsub.publish('NewMessage2', {
          msg2: message,
        });
        return { success: true };
      } catch (error: any) {
        return { error: error?.message };
      }
    },
  },
  Subscription: {
    msg2: {
      subscribe: withFilter(
        (_, args, ctx: GraphQLContext) => {
          console.log('INSIDE SUBSCRIPTION');
          const { pubsub } = ctx;
          return pubsub.asyncIterator('NewMessage2');
        },
        (payload, variables) => {
          console.log('payload: ', payload.msg2.conversationId);
          console.log('variables: ', variables.conversationIds);
          console.log(
            variables.conversationIds.includes(payload.msg2.conversationId)
          );
          // return payload.msg2.conversationId === variables.conversationId;
          // console.log(variables.conversationIds);
          // console.log(payload.msg2.conversationId);
          return variables.conversationIds.includes(
            payload.msg2.conversationId
          );
        }
      ),
    },
  },
};

export default messageResolvers;
