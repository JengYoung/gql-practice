const expressPlayground = require('graphql-playground-middleware-express').default;
const { ApolloServer } = require('apollo-server-express');
const express = require('express');

const { GraphQLScalarType } =require('graphql'); 

const app = express();
app.get('/playground', expressPlayground({ endpoint: '/graphql' }))
/*
 * NOTE: 리졸버 함수에서는 정수, 문자열, 불리언 같은 값 외에도 객체 역시 반환이 가능하다.
 */
const typeDefs = `
  scalar DateTime

  type User {
    githubLogin: ID!
    name: String
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory=PORTRAIT
    description: String
  }

  type Query {
    totalPhotos: Int!
    allPhotos(after: DateTime): [Photo!]!
  }
  
  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`

let _id = 0;
// server Test Data
const users = [
  {
    githubLogin: 'mHattrup',
    name: 'Mike Hattrup'
  },
  {
    githubLogin: 'gPlake',
    name: 'Glen Plake'
  },
  {
    githubLogin: 'eaque',
    name: 'Scot Schmidt'
  },
]

const photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
    created: "3-28-1977"
  },
  {
    id: '2',
    name: 'D27877',
    description: 'Vel fugiat at architecto adipisci voluptatem nulla est aut dolor.',
    category: 'SELFIE',
    githubUser: 'eaque',
    created: "1-2-1985"
  },
  {
    id: '3',
    name: 'Nesciunt eos corporis qui et.',
    description: 'Dolor et ut vitae iure vero illum unde.',
    category: 'LANDSCAPE',
    githubUser: 'eaque',
    created: "2018-04-15T19:09:57.308Z"
  },
];

const tags = [
  {
    photoID: '1',
    userID: 'gPlake'
  },
  {
    photoID: '2',
    userID: 'eaque'
  },
  {
    photoID: '2',
    userID: 'mHattrup'
  },
  {
    photoID: '2',
    userID: 'gPlake'
  },
]

const d = new Date("Tuesday March");
console.log(d.toString()); // Invalid Date

const serialize = value => new Date(value).toISOString(); // "2022-03-17T13:20:00.000Z"

const parseValue = value => new Date(value);

const parseLiteral = ast => ast.value;

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: (parent, args) => {
      args.after;
      return photos;
    },
  },

  Mutation: {
    // 리졸버 함수의 첫 번째 인자는 부모 객체에 대한 참조이다. (여기서는 Mutation)
    // 두 번째 인자는 뮤테이션에 넣어 줄 GraphQL 인자이다.
    postPhoto(parent, args) { 
      const newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date()
      }
      
      photos.push(newPhoto)

      return newPhoto;
    }
  },

  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`, // resolver 함수에 전달되는 첫 번째 인자는 언제나 `parent` 객체이다.
    postedBy: parent => {
      return users.find(u => u.githubLogin === parent.githubUser)
    },
    taggedUsers: parent => tags
      .filter(tag => tag.photoID === parent.id) // 현재 사진에 대한 태그만 배열에 담아 반환
      .map(tag => tag.userID) // 태그 배열을 userID로 전환
      .map(userID => users.find(u => u.githubLogin === userID))
  },

  User: {
    postedPhotos: parent => {
      return photos.filter(p => p.githubUser === parent.githubLogin)
    },
    inPhotos: parent => tags
      .filter(tag => tag.userID === parent.id) // 현재 사용자에 대한 태그만 배열에 담아 반환
      .map(tag => tag.photoID) // 태그 배열을 photoID만 담아 변환
      .map(photoID => photos.find(p => p.id === photoID)) // photoID 배열을 사진 객체 배열로 전환
  },
  // Custom Scalar Type
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
};


(async () => {
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

  // 특정 포트 리스닝

  app
    .listen({ port: 4000 }, () => {
      console.log(`GraphQL Server running at http://localhost:4000${server.graphqlPath}`)
    })
})();
