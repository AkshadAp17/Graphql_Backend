"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typedef_1 = require("./typedef");
const mutation_1 = require("./mutation");
const quries_1 = require("./quries");
const resolver_1 = require("./resolver");
exports.User = {
    typedef: typedef_1.typedef,
    mutation: mutation_1.mutation,
    queries: quries_1.queries,
    resolver: resolver_1.resolver
};
