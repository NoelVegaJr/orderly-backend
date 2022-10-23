"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversationResolvers = {
    Query: {
        getConversations: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const { userId } = args;
            const { session, prisma } = ctx;
            console.log('INSIDE GET CONVERSATIONS QUERY');
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                return { error: 'Not authorized' };
            }
            const conversations = yield prisma.conversation.findMany({
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
            const myConversations = yield prisma.user.findUnique({
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
            const convos = myConversations === null || myConversations === void 0 ? void 0 : myConversations.conversations.map((convo) => {
                return Object.assign(Object.assign({}, convo), { participant: 'lsdjflsk' });
            });
            return conversations;
        }),
    },
    Mutation: {
        createConversation: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            const { participantUserIds } = args;
            console.log('PARTICIPANT IDS: ', participantUserIds);
            const { session, prisma } = ctx;
            if (!((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.id)) {
                return { error: 'Not authorized' };
            }
            const { id: userId } = session.user;
            try {
                const newConversation = yield prisma.conversation.create({
                    data: {
                        ownerId: session.user.id,
                    },
                });
                const participants = yield prisma.conversationParticipant.createMany({
                    data: participantUserIds.map((participantUserId) => {
                        return {
                            conversationId: newConversation.id,
                            userId: participantUserId,
                        };
                    }),
                });
                console.log('PARTICIPANTS: ', participants);
                return { success: true };
            }
            catch (error) {
                return { error: error.message };
            }
            console.log('INSIDE CREATE CONVERSATION RESOLVER 🎉');
        }),
        lastSeenDate: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('visited convo');
            const { participantId, conversationId } = args;
            const { session, prisma } = ctx;
            try {
                yield prisma.conversationParticipant.updateMany({
                    where: {
                        id: participantId,
                        conversationId: conversationId,
                    },
                    data: {
                        lastSeenDate: new Date(),
                    },
                });
            }
            catch (error) { }
        }),
    },
};
exports.default = conversationResolvers;
