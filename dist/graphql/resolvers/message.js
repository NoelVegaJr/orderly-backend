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
exports.messageResolvers = void 0;
const graphql_subscriptions_1 = require("graphql-subscriptions");
exports.messageResolvers = {
    Query: {
        getMessages: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const { conversationId } = args;
            const { session, prisma } = ctx;
            console.log('INSIDE GET MESSAGES: ');
            if (!session) {
                return null;
            }
            try {
                const messages = yield prisma.message.findMany({
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
            }
            catch (error) {
                console.log(error === null || error === void 0 ? void 0 : error.message);
            }
        }),
    },
    Mutation: {
        createMessage: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const { conversationId, participantId, text } = args;
            const { session, prisma } = ctx;
            console.log('INSIDE CREATE MESSAGE: ', conversationId, text);
            if (!session) {
                return { error: 'Not authorized' };
            }
            try {
                const newMessage = yield prisma.message.create({
                    data: {
                        conversationId,
                        text,
                        dateSent: new Date(),
                        participantId: participantId,
                    },
                });
                return { success: true };
            }
            catch (error) {
                return { error: error === null || error === void 0 ? void 0 : error.message };
            }
        }),
        newMessage: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const { conversationId, participantId, text } = args;
            const { session, prisma } = ctx;
            console.log('INSIDE CREATE MESSAGE: ', conversationId, text);
            if (!session) {
                return { error: 'Not authorized' };
            }
            try {
                const newMessage = yield prisma.message.create({
                    data: {
                        conversationId,
                        text,
                        dateSent: new Date(),
                        participantId: participantId,
                    },
                });
                const message = yield prisma.message.findUnique({
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
            }
            catch (error) {
                return { error: error === null || error === void 0 ? void 0 : error.message };
            }
        }),
    },
    Subscription: {
        msg2: {
            subscribe: (0, graphql_subscriptions_1.withFilter)((_, args, ctx) => {
                console.log('INSIDE SUBSCRIPTION');
                const { pubsub } = ctx;
                return pubsub.asyncIterator('NewMessage2');
            }, (payload, variables) => {
                console.log('payload: ', payload.msg2.conversationId);
                console.log('variables: ', variables.conversationIds);
                console.log(variables.conversationIds.includes(payload.msg2.conversationId));
                // return payload.msg2.conversationId === variables.conversationId;
                // console.log(variables.conversationIds);
                // console.log(payload.msg2.conversationId);
                return variables.conversationIds.includes(payload.msg2.conversationId);
            }),
        },
    },
};
exports.default = exports.messageResolvers;
