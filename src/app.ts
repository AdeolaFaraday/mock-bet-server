import express from "express";
import { ApolloServer } from "apollo-server-express";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { buildContext } from "graphql-passport";
import passport from "passport";
import session from "express-session";
import cors from "cors";
import dotenv from "dotenv";
import schema from "./graphql/schema";

export default async function App() {
  const app = express();
  dotenv.config();

  const whitelist = [process.env.CLIENT_SIDE_URL];
  const corsOptions = {
    origin(
      origin: string | undefined,
      callback: (arg0: Error | null, arg1: boolean | undefined) => void
    ) {
      if (
        origin === undefined ||
        whitelist.indexOf(origin) !== -1 ||
        (process.env.NODE_ENV !== "production" &&
          /^https?:\/\/localhost:\d{4}$/.test(origin))
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
    credentials: true,
  };

  // protecting our api from unauthorized origins
  app.use(cors(corsOptions));

  // initializing session and httpOnly cookies
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  app.use(
    session({
      name: "myCookie",
      secret: process.env.DB_CLOUD_CONNECTION_SESSION_STORE as string,
      resave: false,
      saveUninitialized: true,
      // proxy: false,
      // secure: process.env.NODE_ENV !== "development",
      cookie: {
        maxAge: 1000 * 60 * 60 * 24, // One day
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        secure: process.env.NODE_ENV === "production" ? true : false,
      },
      //   store,
      unset: "destroy",
    })
  );

  // initialize passport for auth
  app.use(passport.initialize());
  app.use(passport.session());

  // app.set('trust proxy', 1);
  // app.use(morgan('dev'));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      return buildContext({ req, res });
    },
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground],
  });
  await apolloServer.start();

  apolloServer.applyMiddleware({ app, path: "/graphql", cors: corsOptions });

  app.use("*", (req, res) =>
    res.send(`route not found for ${req.originalUrl}`)
  );

  app.listen(process.env.PORT, () => {
    console.log(
      `Server started on http://localhost:${process.env.PORT}${apolloServer.graphqlPath}`
    );
  });
}

App();
