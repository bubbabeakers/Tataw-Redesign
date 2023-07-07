<script>
  import StreamTag from './StreamTag.svelte';
  import UptimeClock from './UptimeClock.svelte';
  import { formatCount } from '../../utils.js';

  export let description;
  export let followers;
  export let icon;
  export let partner;
  export let stream;
  export let team;
</script>

<div class="stream-details">
  <div class="stream-details-header">
    <img src={icon} alt="Stream Icon" class="stream-icon">
  
    <div class="stream-details-header-inner">
      <div class="stream-name-container">
        <div class="stream-name">{stream.userName}</div>

        {#if partner}
          <img src="/images/verified.svg" alt="Verified Icon" class="verified-icon">
        {/if}
      </div>

      <div class="stream-title">{stream.title}</div>

      <div class="stream-category-and-tags">
        <div class="stream-category">{stream.gameName}</div>

        {#each stream.tags as tag, i (i)}
          <StreamTag {tag} />
        {/each}
      </div>
    </div>

    <div class="viewers-and-uptime-container">
      <div class="viewer-count-container">
        <img src="/images/user-red.svg" alt="User Icon" class="viewer-count-icon">
        {stream.viewerCount}
      </div>

      <UptimeClock startTime={stream.startedAt} />
    </div>
  </div>

  <div class="stream-description-container">
    <div class="stream-description-header">
      About {stream.userName}

      {#if partner}
        <img src="/images/verified.svg" alt="Verified Icon" class="verified-icon">
      {/if}
    </div>

    <div class="follower-count-and-team">
      <span class="follower-count">{formatCount(followers)}</span> followers

      {#if team}
        <span class="stream-team"> ∙ {team}</span>
      {/if}
    </div>

    <p class="stream-description">{description}</p>
  </div>
</div>

<style>
  .stream-details {
    display: flex;
    flex-direction: column;
    font-size: 1.6rem;
    padding: 10px;
    overflow: hidden;
    row-gap: 20px;
  }

  .stream-details-header {
    display: flex;
    align-items: center;
    column-gap: 10px;
  }

  .stream-icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
  }

  .stream-details-header-inner {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    row-gap: 8px;
  }

  .stream-name-container {
    display: flex;
    align-items: center;
    column-gap: 5px;
  }

  .stream-name {
    color: white;
    font-weight: 600;
  }

  .stream-name-container,
  .stream-title {
    width: 100%;
  }

  .stream-title {
    color: white;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .stream-category-and-tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    column-gap: 3px;
    row-gap: 3px;
  }

  .stream-category {
    color: var(--clr-accent);
  }

  .viewers-and-uptime-container {
    display: flex;
    align-items: center;
    column-gap: 8px;
  }

  .viewer-count-container {
    display: flex;
    align-items: center;
    column-gap: 5px;
    color: var(--clr-red);
  }

  .stream-description-container {
    background: var(--clr-primary-light);
    border-radius: var(--border-radius);
    padding: 10px;
    display: flex;
    flex-direction: column;
    row-gap: 15px;
    font-size: 1.4rem;
  }

  .stream-description-header {
    color: white;
    font-size: 2rem;
    font-weight: 600;
    display: flex;
    column-gap: 5px;
  }

  .follower-count-and-team {
    color: var(--clr-gray);
  }

  .follower-count {
    color: white;
    font-weight: 600;
  }

  .stream-team {
    color: var(--clr-accent);
    font-weight: 600;
  }

  .stream-description {
    color: white;
    line-height: 1.5;
  }
</style>