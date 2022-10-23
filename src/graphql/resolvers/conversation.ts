import { CreateConversationResponse, GraphQLContext } from '../../types/types';
const conversationResolvers = {
  Query: {
    getConversations: async (
      _: any,
      args: { userId: string },
      ctx: GraphQLContext
    ) => {
      const { userId } = args;
      const { session, prisma } = ctx;

      console.log('INSIDE GET CONVERSATIONS QUERY');
      if (!session?.user) {
        return { error: 'Not authorized' };
      }

      const conversations = await prisma.conversation.findMany({
        select: {
          id: true,
          owner: true,
          messages: {
            orderBy: {
              dateSent: 'asc',
            },
            include: {
              participant: {
                include: {
                  user: true,
                },
              },
            },
          },
          participants: {
            include: {
              user: true,
            },
          },
        },
        where: {
          participants: {
            some: {
              userId: userId,
            },
          },
        },
      });

      const myConversations = await prisma.user.findUnique({
        where: {
          id: userId,
        },
        select: {
          conversations: {
            select: {
              conversation: {
                include: {
                  participants: true,
                  messages: true,
                },
              },
            },
          },
        },
      });
      const myMap = new Map();
      // const myParticipantObj = myConversations?.conversations.forEach(
      //   (convo) => {
      //     const participent = convo.conversation.participants.filter(
      //       (p) => p.userId === userId
      //     )[0];
      //     const conversationId = convo.conversation.id;
      //     convo.conversation['participant'] = participent;
      //     myMap.set(conversationId, {
      //       ...convo.conversation,
      //     });
      //   }
      // );
      console.log(myMap);
      const convos = myConversations?.conversations.map((convo) => {
        return { ...convo, participant: 'lsdjflsk' };
      });
      return conversations;
    },
  },
  Mutation: {
    createConversation: async (
      _: any,
      args: { participantUserIds: Array<string> },
      ctx: GraphQLContext
    ): Promise<CreateConversationResponse> => {
      const { participantUserIds } = args;
      console.log('PARTICIPANT IDS: ', participantUserIds);
      const { session, prisma } = ctx;
      if (!session?.user?.id) {
        return { error: 'Not authorized' };
      }

      const { id: userId } = session.user;

      try {
        const newConversation = await prisma.conversation.create({
          data: {
            ownerId: session.user.id,
          },
        });

        const participants = await prisma.conversationParticipant.createMany({
          data: participantUserIds.map((participantUserId) => {
            return {
              conversationId: newConversation.id,
              userId: participantUserId,
            };
          }),
        });
        console.log('PARTICIPANTS: ', participants);
        return { success: true };
      } catch (error: any) {
        return { error: error.message };
      }

      console.log('INSIDE CREATE CONVERSATION RESOLVER 🎉');
    },
    lastSeenDate: async (
      _: any,
      args: { participantId: string; conversationId: string },
      ctx: GraphQLContext
    ) => {
      console.log('visited convo');
      const { participantId, conversationId } = args;
      const { session, prisma } = ctx;
      try {
        await prisma.conversationParticipant.updateMany({
          where: {
            id: participantId,
            conversationId: conversationId,
          },
          data: {
            lastSeenDate: new Date(),
          },
        });
      } catch (error: any) {}
    },
  },
};

export default conversationResolvers;
