const expressPlayground = require('graphql-playground-middleware-express').default;
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

/*
 * NOTE: 리졸버 함수에서는 정수, 문자열, 불리언 같은 값 외에도 객체 역시 반환이 가능하다.
 */
// const typeDefs = `
//   scalar DateTime

//   type User {
//     githubLogin: ID!
//     name: String
//     avatar: String
//     postedPhotos: [Photo!]!
//     inPhotos: [Photo!]!
//   }

//   enum PhotoCategory {
//     SELFIE
//     PORTRAIT
//     ACTION
//     LANDSCAPE
//     GRAPHIC
//   }

//   type Photo {
//     id: ID!
//     url: String!
//     name: String!
//     description: String
//     category: PhotoCategory!
//     postedBy: User!
//     taggedUsers: [User!]!
//     created: DateTime!
//   }

//   input PostPhotoInput {
//     name: String!
//     category: PhotoCategory=PORTRAIT
//     description: String
//   }

//   type Query {
//     totalPhotos: Int!
//     allPhotos(after: DateTime): [Photo!]!
//   }
  
//   type Mutation {
//     postPhoto(input: PostPhotoInput!): Photo!
//   }
// `

const { redFileSync, readFileSync } = require('fs');
const typeDefs = readFileSync('./types/typeDefs.graphql', 'UTF-8');

const resolvers = require('./resolvers');

// const d = new Date("Tuesday March");
// console.log(d.toString()); // Invalid Date

// const serialize = value => new Date(value).toISOString(); // "2022-03-17T13:20:00.000Z"

// const parseValue = value => new Date(value);

// const parseLiteral = ast => ast.value;


(async () => {
  const app = express();
  const server = new ApolloServer({
    typeDefs,
    resolvers,
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
