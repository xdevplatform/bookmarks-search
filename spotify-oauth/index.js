const fetch = require('node-fetch');

const authorizeURI = (state, scope = '') => {
  const url = new URL('https://accounts.spotify.com/authorize');
  url.searchParams.append('response_type', 'code');
  url.searchParams.append('client_id', process.env.SPOTIFY_CLIENT_ID);
  url.searchParams.append('redirect_uri', process.env.SPOTIFY_REDIRECT_URI);
  url.searchParams.append('scope', scope);
  url.searchParams.append('state', state);
  return url;
}

const exchangeToken = async (code, callback = process.env.SPOTIFY_REDIRECT_URI) => {
  const url = 'https://accounts.spotify.com/api/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', callback);
  params.append('code_verifier', 'challenge');
  params.append('code', code);

  const authHeader = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(url, {method: 'POST', body: params, headers: {Authorization: `Basic ${authHeader}`}});
  const json = await response.json();
  return json;
}

const refreshToken = async (token, callback = process.env.SPOTIFY_REDIRECT_URI) => {
  const url = 'https://accounts.spotify.com/api/token';
  const params = new URLSearchParams();
  params.append('grant_type', 'refresh_token');
  params.append('refresh_token', token);
  
  const authHeader = Buffer.from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(url, {method: 'POST', body: params, headers: {Authorization: `Basic ${authHeader}`}});
  const json = await response.json();
  return json;
}

// const revokeToken = async (token) => {
//   const url = 'https://api.twitter.com/2/oauth2/revoke';
//   const params = new URLSearchParams();
//   params.append('client_id', process.env.TWITTER_CLIENT_ID);
//   params.append('token', token);
//   params.append('token_type_hint', 'access_token');
  
//   const response = await fetch(url, {method: 'POST', body: params});
//   const json = await response.json();
//   console.log(json);
//   return json;
// }

module.exports = { authorizeURI, exchangeToken, refreshToken };