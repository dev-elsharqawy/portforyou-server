import Database from "./config/database";
import logger from "./lib/utils/logger";

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import http from 'http';
import cors from 'cors';
import { typeDefs, resolvers } from './schema';
import { DEFAULT_PORT } from "./lib/constants";

interface MyContext {
  token?: string;
  req: express.Request;
}

export async function startServer() {
  const db = Database.getInstance();
  await db.connect();
  logger.info('Database connected successfully');

  const app = express();
  const httpServer = http.createServer(app);
  const server = new ApolloServer<MyContext>({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });

  await server.start();

  app.use(
    '/api',
    cors<cors.CorsRequest>({ 
      origin: ['http://localhost:3000', 'https://studio.apollographql.com', "https://portforyou-beta.vercel.app"],
      credentials: true
    }),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        // Get the authorization header
        const token = req.headers.authorization || '';
        
        return {
          token,
          req,
        };
      },
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: DEFAULT_PORT }, resolve));
  logger.info(`Server ready at http://localhost:${DEFAULT_PORT}/api`);

  return httpServer;
}
