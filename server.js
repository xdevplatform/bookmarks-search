const fs = require('fs');
const express = require('express');
const app = express();
require('dotenv').config()

let server;
if (typeof process.env.ENVIRONMENT === 'undefined' || process.env.ENVIRONMENT !== 'production') {
  const key = fs.readFileSync('./cert/localhost/localhost.decrypted.key');
  const cert = fs.readFileSync('./cert/localhost/localhost.crt');
  server = require('https').Server({ key, cert }, app);
} else {
  server = require('http').Server(app);
}

const cookieParser = require('cookie-parser');
const Twitter = require('./twitter-oauth');
const fetch = require('node-fetch');
const res = require('express/lib/response');

require('dotenv').config();

app.use(express.static('build'));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.get('/oauth/:service', async (request, response) => {
  let service = {};
  switch (request.params.service) {
    case 'twitter':
      service = {
        stateKey: 'twitter_state',
        redirectUriKey: 'twitter_redirect_uri',
        tokenKey: 'token',
        provider: Twitter,
        callback: process.env.TWITTER_REDIRECT_URI,
      };
      break;
    default:
      return response.status(400).json({error: 'Invalid service.'});
  }
  if (request.query.state && request.query.code) {
    // exchange token for code
    const tokenData = await service.provider.exchangeToken(request.query.code, service.callback);
    tokenData.expires_at = new Date().getTime() + (tokenData.expires_in * 1000);
    response.clearCookie(service.stateKey);
    response.clearCookie(service.redirectUriKey);
    response.cookie(service.tokenKey, tokenData);

    try {
      const url = new URL(process.env.APP_URL);
      response.redirect(url.href);
    } catch (e) {
      console.error(e);
      const url = new URL(process.env.APP_URL);
      url.searchParams.set('error', '1');
      response.redirect(url.href);
    }
  }
});

app.get('/oauth/:service/refresh', async (request, response) => {
  let service = {};
  switch (request.params.service) {
    case 'twitter':
      service = {
        tokenKey: 'token',
        provider: Twitter
      };
      break;
    default:
      return response.status(400).json({error: 'Invalid service.'});
  }

  if (!request.cookies[service.tokenKey]) {
    return response.status(400).json({error: 'Could not find a token to refresh in your browser session.'});
  }

  const tokenData = await service.provider.refreshToken(request.cookies[service.tokenKey].refresh_token);
  if (tokenData.error) {
    response.status(400).json({error: tokenData.error});
    return;
  }
  
  tokenData.expires_at = new Date().getTime() + (tokenData.expires_in * 1000);
  response.cookie(service.tokenKey, tokenData);
  response.json({refresh: true, token: tokenData});
});

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/build/index.html');
});


app.post('/request', async (request, response) => {
  if (!request.body) {
    return response.status(400).json({error: 'Missing body.'});
  }

  if (!request.body.url.match(/^https\:\/\/api.twitter.com\//)) {
    return response.status(400).json({error: 'Invalid URL.'});
  }

  if (!request.cookies.token) {
    return response.status(400).json({error: 'No access token.'});
  }

  const options = {
    method: request.body.method,
    headers: {
      'Authorization': `Bearer ${request.cookies.token.access_token}`,
      'User-agent': 'TwitterDevBookmarkSearch',
    },
  };

  if (process.env.TWITTER_HEADERS) {
    try {
      twitterHeaders = JSON.parse(process.env.TWITTER_HEADERS);
      options.headers = Object.assign(options.headers, twitterHeaders);
    } catch (e) {
      console.log('Cannot parse Twitter headers:', e.message);
    }
  }

  if (request.body.method === 'PUT' || request.body.method === 'POST' && request.body.body) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(request.body.body);
  }

  let r;
  try {
    r = await fetch(request.body.url, options);  
  } catch (e) {
    console.error(e);
    response.status(400).json({error: e});  
  }

  try {
    const json = await r.json();
    const rateLimitHeaders = {};
    for (const [name, value] of r.headers.entries()) {
      if (name.includes('x-rate-limit')) {
        rateLimitHeaders[name] = value;  
      }
    }
    response.status(200).json({response: json, status: r.status, headers: rateLimitHeaders});
  } catch (e) {
    console.error(e);
    response.status(400).json({error: 'The response is not valid JSON.'});  
  }
  
  
});

app.get('/authorize/:service', async (request, response) => {
  let service;
  switch (request.params.service) {
    case 'twitter':
      service = {
        provider: Twitter,
        scope: 'tweet.read users.read bookmark.read offline.access',
        stateKey: 'twitter_state',
      }
      break;
    }
  const state = new Date().getTime() * (1 + Math.random());
  response.cookie(service.stateKey, state);

  const url = service.provider.authorizeURI(state, service.scope);
  response.redirect(url.toString());

});

app.get('/oauth/twitter/revoke', async (request, response) => {
  if (!request.cookies.token) {
    response.json({revoked: true});
  } else {
    const r = await revokeToken(request.cookies.token.access_token);
    response.clearCookie('token');
    response.json(r);  
  }
  
});

const listener = server.listen(process.env.PORT || 3002, async () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
