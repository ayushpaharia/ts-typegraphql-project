import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import Express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import session from "express-session";
import connectRedis from "connect-redis";
import { redis } from "./redis";

import { formatArgumentValidationError } from "./helpers/formatArgumentValidationError";
import helmet from "helmet";

const bootstrap = async () => {
  // Connects to psql database
  await createConnection();

  const schema = await buildSchema({
    resolvers: [__dirname + "/modules/**/*.ts"],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    },
  });

  const server = new ApolloServer({
    schema,
    context: ({ req, res }: any) => ({ req, res }),
    formatError: formatArgumentValidationError(),
  });

  const app = Express();

  const RedisStore = connectRedis(session);
  const RedisConnectionConfig = {
    store: new RedisStore({
      client: redis as any,
    }),
    name: "qid",
    secret: "asd12r12cdsw32t",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
      sameSite: "none" as any,
      // ephemeral: true, // destorys cookie after browser exit
    },
  };
  app.use(helmet());

  app.use(session(RedisConnectionConfig));
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      credentials: true,
      origin: true,
      allowedHeaders: [
        "Content-Type",
        "Content-Length",
        "Authorization",
        "x-token",
        "x-refresh-token",
      ],
    },
  });

  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(
      `🚀 server started on http://localhost:${PORT}/${server.graphqlPath}`,
    );
  });
};

console.clear();

bootstrap().catch((err) => console.error(err));
