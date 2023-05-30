import { accessTokenMaxAge, refreshTokenMaxAge, userMaxAge } from '$lib/consts.js';
import { CLIENT_ID } from '$env/static/private';
import { getDefaultToken, onAuthenticationFailure, refreshTokens } from '$lib/server/authentication';
import { Api } from 'twitch-js';

export async function handle({ event, resolve }) {
  let accessToken = event.cookies.get('access_token');
  let refreshToken = event.cookies.get('refresh_token');
  let user = event.cookies.get('user') ? JSON.parse(event.cookies.get('user')) : null;

  // if no tokens are set then get a default token for the app, else try and refresh the tokens
  if (!accessToken && !refreshToken) {
    accessToken = await getDefaultToken();
    event.cookies.set('access_token', accessToken, { path: '/', httpOnly: true, secure: true, maxAge: accessTokenMaxAge });
  } else if (!accessToken && refreshToken) {
    [ accessToken, refreshToken ] = await refreshTokens(refreshToken);
    event.cookies.set('access_token', accessToken, { path: '/', httpOnly: true, secure: true, maxAge: accessTokenMaxAge });
    event.cookies.set('refresh_token', refreshToken, { path: '/', httpOnly: true, secure: true, maxAge: refreshTokenMaxAge });
  }

  const api = new Api({
    clientId: CLIENT_ID,
    token: accessToken,
    onAuthenticationFailure: accessToken && refreshToken ? () => onAuthenticationFailure(refreshToken) : undefined
  });

  if (accessToken && refreshToken && !user) {
    user = await api.get('users').then(response => response.data[0]);

    event.cookies.set('user', JSON.stringify(user), { path: '/', httpOnly: true, secure: true, maxAge: userMaxAge });
  }

  event.locals.api = api;
  event.locals.user = user

  return await resolve(event);
}