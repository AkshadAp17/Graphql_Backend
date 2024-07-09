import { CreateUserPayload, UserService } from "../../services/user";

const queries = {
    getusertoken: async (_: any, { email, password }: { email: string; password: string }) => {
        const token = await UserService.getUserToken({ email, password });
        console.log(token)
        return token;
    },
};

const mutation = {
    createUser: async (_: any, { input }: { input: CreateUserPayload }) => {
        const result = await UserService.createUser(input);
        return result.id;
    },
};

export const resolver = { queries, mutation };
