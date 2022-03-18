const fetch = require('node-fetch');
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const requestGithubToken = async (credentials) => {
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(credentials)
    });

    return await res.json();
  } catch(e) {
    console.log("요긴가?")
    throw new Error(JSON.stringify(e));
  }  
};

const requestGithubUserAccount = async (token) => {
  try {
    const res = await fetch(`https://api.github.com/user`, {
      method: "GET",
      headers: {
        Authorization: `token ${token}`
      }
    });

    return await res.json();
  } catch(e) {
    throw new Error(e)
  }
}

module.exports = {
  requestGithubToken,
  requestGithubUserAccount
}