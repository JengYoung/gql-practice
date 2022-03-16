const { ApolloServer } = require('apollo-server');

/*
 * NOTE: 리졸버 함수에서는 정수, 문자열, 불리언 같은 값 외에도 객체 역시 반환이 가능하다.
 */
const typeDefs = `
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
  }  

  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }
  
  type Mutation {
    postPhoto(name: String! description: String): Photo!
  }
`

let _id = 0;
const photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
  },

  Mutation: {
    // 리졸버 함수의 첫 번째 인자는 부모 객체에 대한 참조이다. (여기서는 Mutation)
    // 두 번째 인자는 뮤테이션에 넣어 줄 GraphQL 인자이다.
    postPhoto(parent, args) { 
      const newPhoto = {
        id: _id++,
        ...args
      }
      
      photos.push(newPhoto)

      return newPhoto;
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
})

server
  .listen()
  .then(({ url }) => console.log(`GraphQL Service running on ${url}`))

