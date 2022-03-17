const { MongoClient } = require('mongodb');
require('dotenv').config()

const expressPlayground = require('graphql-playground-middleware-express').default;
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

/*
 * NOTE: 리졸버 함수에서는 정수, 문자열, 불리언 같은 값 외에도 객체 역시 반환이 가능하다.
 */

const { redFileSync, readFileSync } = require('fs');
const typeDefs = readFileSync('./types/typeDefs.graphql', 'UTF-8');
const resolvers = require('./resolvers');

(async () => {
  const app = express();
  const MONGO_DB = process.env.DB_HOST;

  const client = await MongoClient.connect(
    MONGO_DB,
    {
       useNewUrlParser: true
    }
  );

  const db = client.db();

  const context = { db };

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  });

  await server.start();
  server.applyMiddleware({ app })

  /**
   * NOTE: applyMiddleware를 호출하여 미들웨어가 같은 경로에 마운트되도록 호출.
   */

  // HOME ROUTE를 만듦
  app.get('/', (req, res) => res.end('PhotoShare API에 오신 것을 환영합니다!'))
  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))


  // 특정 포트 리스닝

  app
    .listen({ port: 4000 }, () => {
      console.log(`GraphQL Server running at http://localhost:4000${server.graphqlPath}`)
    })
})();
