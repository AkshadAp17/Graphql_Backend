import { CreateUserPayload, UserService } from "../../services/user";

const queries = {
    getusertoken: async (_: any, { email, password }: { email: string; password: string }) => {
        const token = await UserService.getUserToken({ email, password });
        console.log(token);
        return token;
    },
    getcurrentloggeduser: async (_: any, parameters: any, context: any) => {
      if (context && context.user) {
          const id = context.user.id;
          const user = await UserService.getUserById(id);
          
          const profileImageUrl = user?.profileImageUrl ?? 'null';

          return {
              ...user,
              profileImageUrl,
          };
      }
      throw new Error("I don't know who you are");
  },
};

const mutation = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const res = await UserService.createUser(payload);
    return res.id;
  },
};

export const resolver = { queries, mutation };
