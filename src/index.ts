import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloServer from "./graphql";
import { UserService } from "./services/user";

async function init() {
    const app = express();
    const PORT = 8000;
    app.use(express.json());

    app.get("/", (req, res) => {
        res.json({ message: "Server is up and running" });
    });

    app.use(
      "/graphql",
      expressMiddleware(await createApolloServer(), {
        context: async ({ req }) => {
          const token = req.headers['token'];
          console.log("Token from header:", token); // Log token
  
          if (token) {
            try {
              const user = UserService.decodeJWTToken(token as string);
              console.log("Decoded user from token:", user); // Log user
              return { user };
            } catch (error) {
              console.error('Invalid token:', error);
            }
          }
          return {};
        },
      })
    );

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

init();
