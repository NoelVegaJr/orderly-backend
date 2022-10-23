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
const apollo_server_core_1 = require("apollo-server-core");
const taskResolvers = {
    Query: {
        getTaskLists: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('INSIDE GET TASK LISTS 🔥🔥🔥');
            const { conversationId } = args;
            const { session, prisma } = ctx;
            if (!session) {
                return new apollo_server_core_1.ApolloError('Not Authorized');
            }
            try {
                const taskLists = yield prisma.taskList.findMany({
                    where: {
                        conversationId,
                    },
                    include: {
                        tasks: {
                            orderBy: {
                                index: 'asc',
                            },
                        },
                    },
                    orderBy: {
                        index: 'asc',
                    },
                });
                return taskLists;
            }
            catch (error) {
                return { error: error === null || error === void 0 ? void 0 : error.message };
            }
        }),
    },
    Mutation: {
        createTaskList: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('INSIDE CREATE TASKLIST');
            const { session, prisma } = ctx;
            const { conversationId, title } = args;
            if (!session) {
                return { error: 'Not authorized' };
            }
            try {
                const newTaskList = yield prisma.taskList.create({
                    data: { conversationId, title, dateCreated: new Date() },
                });
                return { success: true };
            }
            catch (error) {
                return { error: error === null || error === void 0 ? void 0 : error.message };
            }
        }),
        createTask: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('INSIDE CREATE TASK');
            const { title, taskListId } = args;
            const { session, prisma } = ctx;
            if (!session) {
                return { error: 'Not authorized' };
            }
            try {
                yield prisma.task.create({
                    data: {
                        taskListId,
                        title,
                        dateCreated: new Date(),
                    },
                });
                return { success: true };
            }
            catch (error) {
                return { error: error === null || error === void 0 ? void 0 : error.message };
            }
        }),
        reorderTaskLists: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const { conversationId, taskLists } = args;
            const { session, prisma } = ctx;
            if (!session) {
                return { error: 'Not authorized' };
            }
            for (let taskList of taskLists) {
                console.log(taskList, 'list');
                yield prisma.taskList.update({
                    where: {
                        id: taskList.id,
                    },
                    data: {
                        index: +taskList.index,
                    },
                });
            }
            return { success: true };
        }),
        reorderTasks: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            const { taskListId, tasks } = args;
            const { session, prisma } = ctx;
            if (!session) {
                return { error: 'Not authorized' };
            }
            for (let task of tasks) {
                console.log(task, 'list');
                yield prisma.task.update({
                    where: {
                        id: task.id,
                    },
                    data: {
                        taskListId: taskListId,
                        index: +task.index,
                    },
                });
            }
            return { success: true };
        }),
        createTaskDescription: (_, args, ctx) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('INSIDE TASK DESCRIPTION', args);
            return { success: true };
        }),
    },
};
exports.default = taskResolvers;
