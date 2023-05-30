<script>
  import Chat from "$lib/components/chat/Chat.svelte";
  import Video from "$lib/components/video/Video.svelte";
  
  export let data;
</script>

<div class="channel-layout-container">
  <Video />
  <Chat authenticated={Boolean(data.user)} channel={data.channelInfo.broadcasterLogin} broadcasterId={data.channelInfo.broadcasterId} />
  <div class="channel-info">

  </div>
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