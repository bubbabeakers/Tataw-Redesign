<script>
  import { formatCount } from '$lib/utils.js';
  import StreamLinkTooltip from "$lib/components/sidebar/StreamLinkTooltip.svelte";

  export let stream;
  export let sidebarOpen;
  export let icon;
</script>

<li class="stream-link-container">
  <a href={`/${stream.userLogin}`} class="stream-link" aria-describedby="stream-link-tooltip">
    <img src={icon} alt="Streamer" class="stream-icon">

    {#if sidebarOpen}
      <div class="stream-details">
        <div class="stream-name-and-category">
          <div class="stream-name">{stream.userName}</div>
          <div class="stream-category" title={stream.gameName}>{stream.gameName}</div>
        </div>

        <div class="stream-viewercount">
          <div class="stream-live-icon"></div>
          {formatCount(stream.viewerCount)}
        </div>
      </div>
    {/if}
  </a>
  
  <StreamLinkTooltip id={"stream-link-tooltip"} {stream} {sidebarOpen} />
</li>

<style>
  .stream-link {
    text-decoration: none;
    display: flex;
    padding: 6px 10px;
    column-gap: 10px;
  }

  .stream-link:hover {
    background: var(--clr-primary-light);
  }

  .stream-icon {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    margin: 1px 0;
  }

  .stream-details {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    overflow: hidden;
  }

  .stream-name-and-category {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    row-gap: 5px;
  }

  .stream-name,
  .stream-category {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .stream-name {
    font-size: 1.4rem;
    font-weight: 600;
    color: white;
  }

  .stream-category {
    font-size: 1.3rem;
    color: var(--clr-gray);
  }

  .stream-live-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--clr-red);
  }

  .stream-viewercount {
    display: flex;
    align-items: center;
    font-size: 1.3rem;
    column-gap: 5px;
    color: white;
  }
</style>