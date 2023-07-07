import { redirect } from '@sveltejs/kit';
import { accessTokenMaxAge, refreshTokenMaxAge } from '$lib/consts.js';
import { getTokens } from '$lib/server/authentication.js';
import twitchChat from '$lib/server/twitchChat.js';

export async function GET({ cookies, locals, params, url }) {
  // if the user is already authenticated or the url is missing the authentication code then skip this block
  if (params.slug === 'authenticate' && !locals.user && url.searchParams.get('code')) {
    let authorizationCode = url.searchParams.get('code');
    let [ accessToken, refreshToken ] = await getTokens(authorizationCode);

    // set cookies from the api tokens returned from twitch
    cookies.set('access_token', accessToken, { path: '/', httpOnly: true, secure: true, maxAge: accessTokenMaxAge });
    cookies.set('refresh_token', refreshToken, { path: '/', httpOnly: true, secure: true, maxAge: refreshTokenMaxAge });
  }
      
  // redirect user back to home page
  throw redirect(302, '/');
}

export async function POST({ cookies, locals, params, request }) {
  switch (params.slug) {
    case 'clip': {
      const broadcasterId = await request.text();
      const clipUrl = await locals.api.post('clips', { search: { broadcaster_id: broadcasterId } }).then(response => response.data[0].editUrl);

      return new Response(clipUrl, {
        status: 200,
        statusText: 'OK'
      });
    }
    case 'connectChat': {
      if (!twitchChat.chat) {
        const accessToken = cookies.get('access_token');
        const refreshToken = cookies.get('refresh_token');
        const username = locals.user?.displayName;
        const globalBadges = await locals.api.get('chat/badges/global').then(response => response.data);
  
        twitchChat.initialize(accessToken, refreshToken, username, globalBadges);
      }
  
      let connected = twitchChat.connected;
  
      if (!connected) {
        connected = await twitchChat.connect();
      }
  
      return new Response(connected, {
        status: 200,
        statusText: 'OK'
      });
    }
    case 'disconnectChat': {
      let connected = twitchChat.connected;

      if (connected) {
        connected = await twitchChat.disconnect();
      }

      return new Response(connected, {
        status: 200,
        statusText: 'OK'
      });
    }
    case 'joinChat': {
      const { broadcasterId, channel } = await request.json();
      const channelBadges = await locals.api.get('chat/badges', { search: { broadcaster_id: broadcasterId } }).then(response => response.data);

      let joined = await twitchChat.join(channel, channelBadges);

      return new Response(joined, {
        status: 200,
        statusText: 'OK'
      });
    }
    case 'logout': {
      // if the user is not logged in, redirect them back to home page
      if (!locals.user) {
        throw redirect(302, '/');
      }

      // delete the users cookies so that they are no longer logged into their twitch account
      cookies.delete('access_token', { path: '/' });
      cookies.delete('refresh_token', { path: '/' });
      cookies.delete('user', { path: '/' });

      // return OK response
      return new Response(undefined, {
        status: 200,
        statusText: 'OK'
      });
    }
    default: {
      // if route not found, redirect the user back to home page
      throw redirect(302, '/');
    }
  }
}