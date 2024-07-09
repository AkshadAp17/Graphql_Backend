import { ApolloServer } from "@apollo/server";
import { User } from "./user";

async function createApolloServer() {
    const gqlserv = new ApolloServer({
        typeDefs: `
            ${User.typedef}
            type Query {
                ${User.queries}
            }
            type Mutation {
                ${User.mutation}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolver.queries,
            },
            Mutation: {
                ...User.resolver.mutation,
            },
        },
    });

    await gqlserv.start();
    return gqlserv;
}

export default createApolloServer;
