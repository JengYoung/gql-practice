const { setInternalBufferSize } = require('bson');
const { GraphQLScalarType } = require('graphql');
const githubAuthResolver = require('./resolvers/auth')
const fetch = require('node-fetch');


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
];

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
];

const resolvers = {
  Query: {
    me: (parent, args, { currentUser }) => currentUser,
    totalPhotos: (parent, args, { db }) => {
      return db.collection('photos')
        .estimatedDocumentCount()
    },
    
    allPhotos: (parent, args, { db }) => {
      return db.collection('photos')
        .find()
        .toArray()
    },

    totalUsers: (parent, args, { db}) => {
      return db.collection('users')
        .estimatedDocumentCount()
    },

    allUsers: (parent, args, { db }) => {
      return db.collection('users')
        .find()
        .toArray()
    }
  },

  Mutation: {
    // 리졸버 함수의 첫 번째 인자는 부모 객체에 대한 참조이다. (여기서는 Mutation)
    // 두 번째 인자는 뮤테이션에 넣어 줄 GraphQL 인자이다.
    postPhoto: async (parent, args, { db, currentUser }) => {
      if (!currentUser) {
        throw new Error("Only an authorized user can post a photo.");
      } 
      
      const newPhoto = {
        ...args.input,
        userID: currentUser.githubLogin,
        created: new Date()
      }
      
      const { insertedIds } = await db.collection("photos").insert(newPhoto);
      newPhoto.id = insertedIds[0];

      return newPhoto;
    },
    githubAuth: async (parent, args, db) => {
      return await githubAuthResolver(parent, args, db);
    },

    // NOTE: 생성할 임시 사용자 수를 인자로 받아 사용자 리스트를 반환하는 뮤테이션
    addFakeUsers: async (root, { count }, { db }) => {
      const randomUserAPI = `https://randomuser.me/api/?results=${count}`;

      const { results } = await fetch(randomUserAPI).then(res => res.json());

      const users = results.map(result => ({ 
        githubLogin: result.login.username,
        name: `${result.name.first} ${result.name.last}`,
        avatar: result.picture.thumbnail,
        githubToken: result.login.sha1
      }));

      await db.collection('users').insert(users);

      return users;
    }
  },

  Photo: {
    id: parent => parent.id || parent._id,
    url: parent => `/img/photos/${parent._id}.jpg`, // resolver 함수에 전달되는 첫 번째 인자는 언제나 `parent` 객체이다.
    postedBy: (parent, args, { db }) => {
      return db.collection('users').findOne({ githubLogin: parent.userID })
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
  }),
};

// export default resolvers
module.exports = resolvers;