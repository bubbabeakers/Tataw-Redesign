<script>
  import { formatCount as formatCount } from '$lib/utils.js';
  import LiveTag from './LiveTag.svelte';
  import StreamTag from './StreamTag.svelte';

  export let stream;
  export let icon;
  export let thumbnailWidth;

  let thumbnailUrl = stream.thumbnailUrl.replace('{width}x{height}', '300x169');
</script>

<div class="stream-card" style={`width: ${thumbnailWidth}px`}>
  <a href={`/${stream.userLogin}`} class="stream-thumbnail-link">
    <img src={thumbnailUrl} alt="Stream Thumbnail" class="stream-thumbnail" style={`width: ${thumbnailWidth}px`}>
    <LiveTag />
    <div class="stream-viewercount">
      {formatCount(stream.viewerCount)} viewers
    </div>
  </a>

  <div class="stream-icon-and-details">
    <a href={`/${stream.userLogin}`} class="channel-icon-link">
      <img src={icon} alt="Channel Icon" class="channel-icon">
    </a>

    <div class="stream-details">
      <a href={`/${stream.userLogin}`} class="stream-title" title={stream.title}>{stream.title}</a>
      <div class="stream-name">{stream.userName}</div>
      <a href={`/directory/game/${encodeURIComponent(stream.gameName)}`} class="stream-category">{stream.gameName}</a>

      {#if stream.tags}
        <div class="stream-tags">
          {#each stream.tags as tag, i (i)}
            <StreamTag {tag} />        
          {/each}
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  .stream-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .stream-thumbnail-link {
    position: relative;
    display: flex;
  }

  .stream-thumbnail-link:hover::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    box-shadow: inset 0 0 0 4px var(--clr-accent-dark);
  }

  .channel-icon-link {
    display: flex;
    align-self: flex-start;
  }

  .stream-thumbnail {
    aspect-ratio: 16 / 9;
  }

  .stream-thumbnail-link > :global(.live-tag) {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .stream-viewercount {
    position: absolute;
    left: 10px;
    bottom: 10px;
    background: rgba(0, 0, 0, .7);
    color: white;
    font-size: 1.4rem;
    padding: 6px;
    border-radius: var(--border-radius);
    user-select: none;
  }

  .stream-icon-and-details {
    display: flex;
    padding: 10px 0;
    column-gap: 10px;
    overflow: hidden;
  }

  .channel-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }

  .stream-details {
    display: flex;
    flex-direction: column;
    row-gap: 6px;
    overflow: hidden;
  }

  .stream-title {
    color: white;
    font-size: 1.4rem;
    font-weight: 600;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-decoration: none;
  }

  .stream-title:hover,
  .stream-category:hover {
    color: var(--clr-accent-dark);
  }

  .stream-name,
  .stream-category {
    font-size: 1.3rem;
    color: var(--clr-gray);
  }

  .stream-category {
    text-decoration: none;
  }

  .stream-tags {
    display: flex;
    flex-wrap: wrap;
    column-gap: 3px;
    row-gap: 3px;
  }
</style>