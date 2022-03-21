import {
  requestGithubToken,
  requestGithubUserAccount,
} from '../utils/auth/githubAuth.js';

const authorizeWithGithub = async (credentials) => {
  const { access_token } = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);

  return {
    ...githubUser,
    access_token,
  };
};

const githubAuthResolver = async (parent, { code }, { db }) => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

  try {
    let { message, access_token, avatar_url, login, name } =
      await authorizeWithGithub({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code: code,
      });

    if (message) {
      throw new Error(message);
    }

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url,
    };

    await db
      .collection('users')
      .replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true });

    const user = await db.collection('users').findOne(latestUserInfo);

    return { user, token: access_token };
  } catch (e) {
    console.log('githubAuthResolver error occurred...', e);
    throw new Error(e);
  }
};

export default githubAuthResolver;
