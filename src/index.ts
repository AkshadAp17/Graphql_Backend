import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createaplloserver from "./graphql";

async function init() {
  const app = express();
  const PORT = 8000;
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  app.use("/graphql", expressMiddleware(await createaplloserver()));

  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

init();
