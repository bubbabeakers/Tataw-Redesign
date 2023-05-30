export async function load({ locals, params }) {
  const channel = params.channel;
  const channelUserInfo = await locals.api.get('users', {
    search: {
      login: channel
    }
  }).then(response => response.data[0]);
  let channelInfo = [];

  if (channelUserInfo) {
    const broadcasterId = channelUserInfo.id;
    channelInfo = await locals.api.get('channels', {
      search: {
        broadcaster_id: broadcasterId
      }
    }).then(response => response.data[0]);
  }

  return { channelInfo: channelInfo };
}