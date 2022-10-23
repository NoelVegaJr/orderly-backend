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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_express_1 = require("apollo-server-express");
const apollo_server_core_1 = require("apollo-server-core");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const schema_1 = require("@graphql-tools/schema");
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const typeDefs_1 = __importDefault(require("./graphql/typeDefs"));
const resolvers_1 = __importDefault(require("./graphql/resolvers"));
const react_1 = require("next-auth/react");
const client_1 = require("@prisma/client");
const graphql_subscriptions_1 = require("graphql-subscriptions");
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = require("body-parser");
const { PORT = 4005, APP_URL } = process.env;
const app = (0, express_1.default)();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        app.use((0, cors_1.default)(), (0, body_parser_1.json)());
        const httpServer = http_1.default.createServer(app);
        app.get('/', (req, res) => res.send({ ok: true }));
        app.get('/test', (req, res) => res.send({ ok: true }));
        const corsOptions = {
            origin: APP_URL,
            credentials: true,
        };
        // context parameters
        const prisma = new client_1.PrismaClient();
        const pubsub = new graphql_subscriptions_1.PubSub();
        const getSubscriptionContext = (ctx) => __awaiter(this, void 0, void 0, function* () {
            ctx;
            // ctx is the graphql-ws Context where connectionParams live
            if (ctx.connectionParams && ctx.connectionParams.session) {
                const { session } = ctx.connectionParams;
                console.log('IN CONTEXT BUILDER');
                return { session, prisma, pubsub };
            }
            // Otherwise let our resolvers know we don't have a current user
            return { session: null, prisma, pubsub };
        });
        const schema = (0, schema_1.makeExecutableSchema)({ typeDefs: typeDefs_1.default, resolvers: resolvers_1.default });
        const wsServer = new ws_1.WebSocketServer({
            // This is the `httpServer` we created in a previous step.
            server: httpServer,
            // Pass a different path here if your ApolloServer serves at
            // a different path.
            path: '/graphql',
        });
        // Save the returned server's info so we can shutdown this server later
        const serverCleanup = (0, ws_2.useServer)({
            schema,
            context: (ctx) => {
                // This will be run every time the client sends a subscription request
                // Returning an object will add that information to our
                // GraphQL context, which all of our resolvers have access to.
                return getSubscriptionContext(ctx);
            },
        }, wsServer);
        const server = new apollo_server_express_1.ApolloServer({
            schema,
            csrfPrevention: true,
            cache: 'bounded',
            context: ({ req }) => __awaiter(this, void 0, void 0, function* () {
                const session = (yield (0, react_1.getSession)({ req }));
                return { session, prisma, pubsub };
            }),
            plugins: [
                (0, apollo_server_core_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
                {
                    serverWillStart() {
                        return __awaiter(this, void 0, void 0, function* () {
                            return {
                                drainServer() {
                                    return __awaiter(this, void 0, void 0, function* () {
                                        yield serverCleanup.dispose();
                                    });
                                },
                            };
                        });
                    },
                },
                (0, apollo_server_core_1.ApolloServerPluginLandingPageLocalDefault)({ embed: true }),
            ],
        });
        yield server.start();
        server.applyMiddleware({ app, path: '/graphql' });
        // await new Promise<void>((resolve) =>
        //   httpServer.listen({ port: PORT }, resolve)
        // );
        httpServer.listen(PORT, () => {
            console.log(`Server is now running on http://localhost:${PORT}${server.graphqlPath}`);
            console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
        });
    });
}
main().catch((error) => console.log(error));
exports.default = app;
