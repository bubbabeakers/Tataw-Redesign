import { CLIENT_ID } from '$env/static/private';
import { authorizationUrl, logoutUrl, redirectUrl, scopes } from '$lib/consts.js';

export async function load({ locals }) {
  const user = locals.user;
  let followedStreams = [];
  const topStreams = await locals.api.get('streams', {
    search: {
      first: 100
    }
  }).then(response => response.data);

  if (user) {
    followedStreams = await locals.api.get('streams/followed', {
      search: {
        user_id: user.id
      }
    }).then(response => response.data);
  }
  
  // combine topStreams and followedStreams into one array, making sure each stream is unique
  const allStreams = topStreams.concat(followedStreams.filter(followedStream => !topStreams.some(topStream => topStream.userId == followedStream.userId)));
  const streamUserIds = allStreams.map(stream => stream.userId);
  const numIds = 100;
  let streamInfo = [];
  
  for (let i = 0; i < streamUserIds.length; i += numIds) {
    const userInfo = await locals.api.get('users', {
      search: {
        id: streamUserIds.slice(i, i + numIds)
      }
    }).then(response => response.data);
    
    streamInfo.push(...userInfo);
  }

  const loginUrlParameters = new URLSearchParams({
    client_id: CLIENT_ID,
    force_verify: true,
    redirect_uri: redirectUrl,
    response_type: 'code',
    scope: scopes
  });
  const loginUrl = authorizationUrl + "?" + loginUrlParameters;

  const signupUrlParameters = new URLSearchParams({
    client_id: CLIENT_ID,
    force_verify: true,
    redirect_uri: redirectUrl,
    response_type: 'code',
    scope: scopes
  });
  const signupUrl = `${logoutUrl}?login_type=signup&redirect_path=${encodeURIComponent(authorizationUrl)}&redirect_params=${encodeURIComponent(signupUrlParameters)}`;

  return {
    user: user,
    loginUrl: loginUrl,
    signupUrl: signupUrl,
    topStreams: topStreams,
    followedStreams: followedStreams,
    streamInfo: streamInfo
  };
}