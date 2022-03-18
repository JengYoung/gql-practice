const { requestGithubToken, requestGithubUserAccount } = require("../utils/auth/githubAuth");

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const authorizeWithGithub = async (credentials) => {
  const { access_token } = await requestGithubToken(credentials);
  // console.log('access_token', access_token)
  const githubUser = await requestGithubUserAccount(access_token);

  // console.log('result: ', {
  //   ...githubUser,
  //   access_token
  // })

  console.log('githubUserMessage: ', githubUser.message)
  return {
    ...githubUser,
    access_token
  }
}

const githubAuthResolver = async (parent, { code }, { db }) => {
  try {
    let { 
      message,
      access_token,
      avatar_url,
      login,
      name
    } = await authorizeWithGithub({
      client_id: GITHUB_CLIENT_ID,
      client_secret: GITHUB_CLIENT_SECRET,
      code: code,
    });
  
    console.log("resolver: ", name, login, access_token, avatar_url)
  
    if (message) {
      console.log("message: ", message)
      throw new Error(message);
    }
  
    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    };
  
    const {
      ops
    } = await db
      .collection("users")
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
    console.log(ops)
  
    console.log("ops, token: ", ops, access_token)

    return { user, token: access_token };
  } catch(e) {
    console.log('hi...')
    throw new Error(e)
  }
}

module.exports = githubAuthResolver