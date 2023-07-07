<script>
  import StreamLink from "$lib/components/sidebar/StreamLink.svelte";
  import Tooltip from "$lib/components/general/Tooltip.svelte";
  import { getStreamIcon } from '$lib/utils.js';

  export let authenticated;
  export let streams;
  export let streamInfo;

  let sidebarOpen = true;
  let numInitialStreams = 15;
  let numStreams = numInitialStreams;
  let numStreamsIncrement = 10;

  function toggleSidebar() {
    sidebarOpen = !sidebarOpen;
  }

  function showMoreStreams() {
    if (numStreams < streams.length) {
      numStreams += numStreamsIncrement;
    }
  }

  function showLessStreams() {
    if (numStreams > numInitialStreams) {
      numStreams -= numStreamsIncrement;
    }
  }
</script>

<aside class="sidebar" class:open={sidebarOpen}>
  <nav class="sidebar-nav">
    <ol class="sidebar-list">
      <li class="sidebar-header">
        {#if sidebarOpen}
          <div class="sidebar-header-title">{authenticated ? 'Followed Channels' : 'Top Channels'}</div>
        {/if}
        
        {#if streams.length}
          <button class="sidebar-header-button" on:click={toggleSidebar} aria-describedby="sidebar-header-button-tooltip">
            <img src="/images/collapse-expand.svg" alt={sidebarOpen ? 'Collapse' : 'Expand'} class:horizontalFlip={!sidebarOpen} class="sidebar-header-button-icon">
          </button>
          <Tooltip id={"sidebar-header-button-tooltip"} text={sidebarOpen ? 'Collapse' : 'Expand'} placement={"right"} />
        {/if}
      </li>

      <li class="sidebar-stream-type" class:hide={sidebarOpen}>
        {#if authenticated}
          <img src="/images/heart.svg" alt="Heart" class="sidebar-stream-type-icon" aria-describedby="sidebar-stream-type-tooltip">
        {:else}
          <img src="/images/camera.svg" alt="Camera" class="sidebar-stream-type-icon" aria-describedby="sidebar-stream-type-tooltip">
        {/if}

        <Tooltip id={"sidebar-stream-type-tooltip"} text={authenticated ? 'Followed Channels' : 'Top Channels'} placement={'right'} />
      </li>

      <div class="sidebar-stream-links-container">
        {#each streams.slice(0, numStreams) as stream, i (i)}
          <StreamLink {stream} icon={getStreamIcon(stream.userName, streamInfo)} {sidebarOpen} />
        {:else}
          <div class="no-streams-message">
            <div class="no-streams-message-icon-container">
              <img src="/images/alert.svg" alt="Alert" class="no-streams-message-icon" aria-describedby={'no-streams-message-tooltip'}>
              <Tooltip id={"no-streams-message-tooltip"} text={"No followed channels yet"} placement={"right"} />
            </div>

            <div class="no-streams-message-text">No followed channels yet</div>
          </div>
        {/each}
      </div>

      {#if sidebarOpen && (numStreams < streams.length || numStreams > numInitialStreams)}
        <li class="show-buttons-container">
          {#if numStreams < streams.length}
            <button class="show-button" on:click={showMoreStreams}>Show More</button>
          {/if}

          {#if numStreams > numInitialStreams}
            <button class="show-button" on:click={showLessStreams}>Show Less</button>
          {/if}
        </li>
      {/if}
    </ol>
  </nav>
</aside>

<style>
  @property --scrollbar-thumb-color {
    syntax: "<color>";
    inherits: true;
    initial-value: rgb(206, 208, 206, 0);
  }
  
  @keyframes fadeIn {
    0% {
      --scrollbar-thumb-color: rgb(206, 208, 206, 0);
    }

    100% {
      --scrollbar-thumb-color: rgb(206, 208, 206, 1);
    }
  }

  @keyframes fadeOut {
    0% {
      --scrollbar-thumb-color: rgb(206, 208, 206, 1);
    }

    100% {
      --scrollbar-thumb-color: rgb(206, 208, 206, 0);
    }
  }

  .sidebar {
    background: var(--clr-primary);
  }

  .sidebar-nav {
    height: 100%;
  }

  .sidebar-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow-x: hidden;
    overflow-y: auto;
    animation: fadeOut .5s ease-in-out forwards;
  }

  .sidebar-list:hover {
    animation: fadeIn .5s ease-in-out forwards;
  }

  .sidebar-list::-webkit-scrollbar {
    width: 10px;
  }

  .sidebar-list::-webkit-scrollbar-thumb {
    background: var(--scrollbar-thumb-color);
    border-radius: 100vw;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  :global(.sidebar-list > li) {
    list-style: none;
  }

  .sidebar-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    position: sticky;
    top: 0;
    background: var(--clr-primary);
    border-bottom: 1px solid var(--clr-primary-light);
  }

  .sidebar-header-title {
    color: white;
    font-size: 1.8rem;
    font-weight: 600;
    padding: 6px 0;
  }

  .sidebar-header-button {
    padding: 7px;
    border-radius: var(--border-radius);
    display: flex;
  }

  .sidebar-header-button:hover {
    background: var(--clr-primary-light);
  }

  .sidebar-stream-type {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 7px 10px;
  }

  .sidebar-stream-type-icon {
    padding: 7px;
  }

  .sidebar-stream-links-container {
    display: flex;
    flex-direction: column;
  }

  .no-streams-message-icon-container {
    display: none;
    padding: 7px 10px;
  }

  .no-streams-message-icon {
    padding: 7px;
  }

  .no-streams-message-text {
    color: var(--clr-gray);
    font-size: 1.4rem;
    padding: 15px 10px;
  }

  .show-buttons-container {
    display: flex;
    justify-content: space-between;
    padding: 10px;
  }

  .show-button {
    font-size: 1.4rem;
    color: var(--clr-accent);
  }

  .show-button:hover {
    text-decoration: underline;
    color: var(--clr-accent-dark);
  }

  .horizontalFlip {
    transform: scaleX(-1);
  }

  .open {
    width: var(--sidebar-width);
  }

  .hide {
    display: none;
  }

  @media screen and (max-width: 1199px) {
    .sidebar {
      width: auto;
    }

    .sidebar-header,
    .show-buttons-container,
    .no-streams-message-text,
    :global(.stream-link-container > .stream-link > .stream-details) {
      display: none;
    }

    .no-streams-message-icon-container {
      display: flex;
    }

    .sidebar-stream-type {
      display: flex;
    }

    :global(.stream-link-tooltip > .stream-name-and-category),
    :global(.stream-link-tooltip > .stream-viewercount) {
      display: flex;
    }
  }
</style>