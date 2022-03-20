import fetch from 'node-fetch';

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

export const requestGithubToken = async (credentials) => {
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(credentials),
    });

    return await res.json();
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
};

export const requestGithubUserAccount = async (token) => {
  try {
    const res = await fetch('https://api.github.com/user', {
      method: 'GET',
      headers: {
        Authorization: `token ${token}`,
      },
    });

    return await res.json();
  } catch (e) {
    throw new Error(e);
  }
};
