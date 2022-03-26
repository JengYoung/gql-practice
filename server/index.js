import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { MongoClient } from 'mongodb';

import expressPlayground from 'graphql-playground-middleware-express';
import { ApolloServer } from 'apollo-server-express';
import graphqlSubscriptions from 'graphql-subscriptions';

import { readFileSync } from 'fs';

import resolvers from './resolvers.js';

// web socket
import { createServer } from 'http';
import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core';

/*
 * NOTE: 리졸버 함수에서는 정수, 문자열, 불리언 같은 값 외에도 객체 역시 반환이 가능하다.
 */

const typeDefs = readFileSync('./types/typeDefs.graphql', 'UTF-8');

const app = express();
const MONGO_DB = process.env.DB_HOST;

const PORT = 4000;

(async () => {
  const client = await MongoClient.connect(MONGO_DB, {
    useNewUrlParser: true,
  })
    .then((res) => {
      console.log('MongoDB connected...');
      return res;
    })
    .catch((e) => {
      console.error('MongoDB cannot connect...');
    });

  const db = client.db();

  // const context = { db };

  const { PubSub } = graphqlSubscriptions;
  const pubsub = new PubSub();

  const httpServer = createServer(app);
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: '/graphql',
  });

  const schema = makeExecutableSchema({ typeDefs, resolvers });
  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({ schema }, wsServer);

  const server = new ApolloServer({
    schema,
    plugins: [
      // Proper shutdown for the HTTP server.
      ApolloServerPluginDrainHttpServer({ httpServer }),

      // Proper shutdown for the WebSocket server.
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
      ApolloServerPluginLandingPageGraphQLPlayground({
        settings: {
          'some.setting': true,
          'general.betaUpdates': false,
          'editor.theme': 'dark',
          'editor.cursorShape': 'line',
          'editor.reuseHeaders': true,
          'tracing.hideTracingResponse': true,
          'queryPlan.hideQueryPlanResponse': true,
          'editor.fontSize': 14,
          'editor.fontFamily': `'Source Code Pro', 'Consolas', 'Inconsolata', 'Droid Sans Mono', 'Monaco', monospace`,
          'request.credentials': 'omit',
        },
      }),
    ],

    context: async ({ req }) => {
      const githubToken = req.headers.authorization;
      const currentUser = await db.collection('users').findOne({ githubToken });

      return { db, currentUser, pubsub };
    },
  });

  await server.start();
  /**
   * NOTE: applyMiddleware를 호출하여 미들웨어가 같은 경로에 마운트되도록 호출.
   */
  server.applyMiddleware({ app });

  // HOME ROUTE를 만듦
  app.get('/', (req, res) => res.end('PhotoShare API에 오신 것을 환영합니다!'));
  // app.get('/playground', expressPlayground.default({ endpoint: '/graphql' }));

  // 특정 포트 리스닝
  // app.listen({ port: 4000 }, () => {
  //   console.log(
  //     `GraphQL Server running at http://localhost:4000${server.graphqlPath}`
  //   );
  // });

  httpServer.listen(PORT, () => {
    console.log(
      `GraphQL Server running at http://localhost:${PORT}${server.graphqlPath}`
    );
    console.log(
      `GraphQL wsServer running at ws://localhost:${PORT}${server.graphqlPath}`
    );
  });
})();
