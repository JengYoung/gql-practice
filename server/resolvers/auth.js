const { requestGithubToken, requestGithubUserAccount } = require("../utils/auth/githubAuth");

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const authorizeWithGithub = async (credentials) => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);

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
      throw new Error(message);
    }
  
    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    };
  
    const { ops: [user] } = await db
      .collection("users")
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });
  
    console.log("ops, token: ", user, access_token)

    return { user, token: access_token };
  } catch(e) {
    console.log('githubAuthResolver error occurred...', e)
    throw new Error(e)
  }
}

module.exports = githubAuthResolver