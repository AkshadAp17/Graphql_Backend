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
exports.resolver = void 0;
const user_1 = require("../../services/user");
const queries = {
    getusertoken: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { email, password }) {
        const token = yield user_1.UserService.getUserToken({ email, password });
        console.log(token);
        return token;
    }),
};
const mutation = {
    createUser: (_1, _a) => __awaiter(void 0, [_1, _a], void 0, function* (_, { input }) {
        const result = yield user_1.UserService.createUser(input);
        return result.id;
    }),
};
exports.resolver = { queries, mutation };
