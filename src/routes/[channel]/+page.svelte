<script>
  import Chat from "$lib/components/chat/Chat.svelte";
  import Video from "$lib/components/video/Video.svelte";
  import StreamDetails from "../../lib/components/general/StreamDetails.svelte";
  
  export let data;
</script>

<div class="channel-layout-container">
  <Video channel={data.broadcasterInfo.login} broadcasterId={data.broadcasterInfo.id} />
  <Chat
    authenticated={Boolean(data.user)} 
    channel={data.broadcasterInfo.login} 
    broadcasterId={data.broadcasterInfo.id} 
    channelEmotes={data.channelEmotes} 
    globalEmotes={data.globalEmotes} 
  />
  <StreamDetails icon={data.broadcasterInfo.profileImageUrl} stream={data.streamInfo} followers={data.followers} team={data.team} description={data.broadcasterInfo.description} partner={data.broadcasterInfo.broadcasterType} />
</div>

<style>
  .channel-layout-container {
    display: grid;
    grid-template-columns: 1fr auto;
    grid-template-rows: auto 1fr;
    height: 100%;
  }

  :global(.channel-layout-container > *) {
    min-height: 0;
  }

  :global(.channel-layout-container > *:nth-child(2)) {
    grid-row: span 2;
  }
</style>