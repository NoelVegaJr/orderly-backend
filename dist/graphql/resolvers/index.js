"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolvers = void 0;
const lodash_merge_1 = __importDefault(require("lodash.merge"));
const user_1 = __importDefault(require("./user"));
const conversation_1 = __importDefault(require("./conversation"));
const message_1 = __importDefault(require("./message"));
const task_1 = __importDefault(require("./task"));
exports.resolvers = (0, lodash_merge_1.default)({}, user_1.default, conversation_1.default, message_1.default, task_1.default);
exports.default = exports.resolvers;
