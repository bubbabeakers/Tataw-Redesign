export async function load({ locals, params }) {
  let channel = params.channel;
  let broadcasterInfo = await locals.api.get('users', {
    search: {
      login: channel
    }
  }).then(response => response.data[0]);

  let streamInfo = [];
  let channelEmotes = [];
  let globalEmotes = [];
  let followers = 0;
  let team = null;
  
  // if channel exists, fetch channel and global data
  if (broadcasterInfo) {
    let broadcasterId = broadcasterInfo.id;

    streamInfo = await locals.api.get('streams', {
      search: {
        user_id: broadcasterId
      }
    }).then(response => response.data[0]);

    channelEmotes = await locals.api.get('chat/emotes', {
      search: {
        broadcaster_id: broadcasterId
      }
    }).then(response => response.data);

    globalEmotes = await locals.api.get('chat/emotes/global').then(response => response.data);

    followers = await locals.api.get('channels/followers', {
      search: {
        broadcaster_id: broadcasterId
      }
    }).then(response => response.total);

    team = await locals.api.get('teams/channel', {
      search: {
        broadcaster_id: broadcasterId
      }
    }).then(response => response.data ? response.data.teamDisplayName : '');
  }

  return {
    broadcasterInfo: broadcasterInfo,
    channelEmotes: channelEmotes,
    followers: followers,
    globalEmotes: globalEmotes,
    streamInfo: streamInfo,
    team: team
  };
}