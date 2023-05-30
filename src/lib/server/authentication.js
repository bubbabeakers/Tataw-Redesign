import { redirectUrl, tokenUrl } from '../consts.js';
import { error } from '@sveltejs/kit';
import { CLIENT_ID, CLIENT_SECRET } from '$env/static/private';

export async function getTokens(authorizationCode) {
  const parameters = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code: authorizationCode,
    grant_type: 'authorization_code',
    redirect_uri: redirectUrl
  });

  return fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: parameters
  }).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw error(response.status, {
      message: response.statusText
    });
  }).then(response => [ response.access_token, response.refresh_token ]);
}

export async function getDefaultToken() {
  const parameters = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'client_credentials'
  });

  return fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: parameters
  }).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw error(response.status, {
      message: response.statusText
    });
  }).then(response => response.access_token);
}

export async function refreshTokens(refreshToken) {
  const parameters = new URLSearchParams({
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken
  });

  return fetch(tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: parameters
  }).then(response => {
    if (response.ok) {
      return response.json();
    }

    throw error(response.status, {
      message: response.statusText
    });
  }).then(response => [ response.access_token, response.refresh_token ]);
}

export async function onAuthenticationFailure(refreshToken) {
  const [ access_token ] = await refreshTokens(refreshToken);
  return access_token;
}