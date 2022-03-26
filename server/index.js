import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { MongoClient } from 'mongodb';

import expressPlayground from 'graphql-playground-middleware-express';
import { ApolloServer } from 'apollo-server-express';

import { readFileSync } from 'fs';

import resolvers from './resolvers.js';

// web socket
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

/*
 * NOTE: 리졸버 함수에서는 정수, 문자열, 불리언 같은 값 외에도 객체 역시 반환이 가능하다.
 */

const typeDefs = readFileSync('./types/typeDefs.graphql', 'UTF-8');

const app = express();
const MONGO_DB = process.env.DB_HOST;

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

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const githubToken = req.headers.authorization;
      const currentUser = await db.collection('users').findOne({ githubToken });

      return { db, currentUser };
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  const webSocketServer = new WebSocketServer({
    port: 4001,
    path: '/graphql',
  });

  useServer({}, webSocketServer);
  console.log('Listening to port 4001...');

  /**
   * NOTE: applyMiddleware를 호출하여 미들웨어가 같은 경로에 마운트되도록 호출.
   */

  // HOME ROUTE를 만듦
  app.get('/', (req, res) => res.end('PhotoShare API에 오신 것을 환영합니다!'));
  app.get('/playground', expressPlayground.default({ endpoint: '/graphql' }));

  // 특정 포트 리스닝

  app.listen({ port: 4000 }, () => {
    console.log(
      `GraphQL Server running at http://localhost:4000${server.graphqlPath}`
    );
  });
})();
