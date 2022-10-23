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
exports.userResolvers = void 0;
const apollo_server_core_1 = require("apollo-server-core");
exports.userResolvers = {
    Query: {
        searchUsers: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const { searchedUsername } = args;
            const { session, prisma } = ctx;
            console.log(session);
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                console.log('no user found');
                return new apollo_server_core_1.ApolloError('Not authorized');
            }
            const { user: { username: myUsername }, } = session;
            try {
                const users = yield prisma.user.findMany({
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
            }
            catch (error) {
                console.log('searchUsers error', error);
                throw new apollo_server_core_1.ApolloError(error === null || error === void 0 ? void 0 : error.message);
            }
        }),
    },
    Mutation: {
        createUsername: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('hello');
            const { username } = args;
            const { session, prisma } = ctx;
            console.log(session);
            if (!(session === null || session === void 0 ? void 0 : session.user)) {
                return { error: 'Not authorized' };
            }
            const { id } = session.user;
            try {
                const existingUsername = yield prisma.user.findFirst({
                    where: {
                        username: username,
                    },
                });
                if (existingUsername) {
                    console.log('username exists');
                    return { error: 'This username already exists' };
                }
                yield ctx.prisma.user.update({
                    where: {
                        id: id,
                    },
                    data: {
                        username,
                    },
                });
                return { success: true };
            }
            catch (error) {
                console.log(error);
                return { error: error.message };
            }
        }),
        createNewMessage: (_, args, ctx) => {
            console.log(args.text);
            ctx.pubsub.publish('NewMessage', {
                msg: args.text,
            });
            return args.text;
        },
    },
    Subscription: {
        msg: {
            subscribe: (parent, __, context) => {
                // console.log(context);
                const { pubsub } = context;
                return pubsub.asyncIterator(['NewMessage']);
            },
        },
    },
};
exports.default = exports.userResolvers;
