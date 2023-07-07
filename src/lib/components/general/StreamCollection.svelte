<script>
  import { onMount } from "svelte";
  import StreamCard from "./StreamCard.svelte";
  import { getStreamIcon } from '$lib/utils.js';

  export let streams;
  export let streamInfo;
  export let title;

  let streamsContainer;
  let thumbnailWidth = 300;
  let columnGap = 8;
  let numColumns = 1;
  let numRows = 4;

  $: numStreams = numColumns * numRows;

  onMount(() => {
    let observer = new ResizeObserver(getNumColumns);

    observer.observe(streamsContainer);

    return () => observer.unobserve(streamsContainer);
  });

  function getNumColumns(entries) {
    for (const entry of entries) {
      if (entry.contentRect.width < 390) {
        thumbnailWidth = 230;
      } else if (entry.contentRect.width) {
        thumbnailWidth = 300;
        numColumns = 1 + Math.floor((entry.contentRect.width - thumbnailWidth) / (thumbnailWidth + columnGap));
      }
    }
  }

  function showMoreStreams() {
    numRows += 1;
  }
</script>

<div class="streams-container" bind:this={streamsContainer} style={`column-gap: ${columnGap}px`}>
  <h1 class="streams-header">{@html title}</h1>

  {#each streams.slice(0, numStreams) as stream, i (i)}
    <StreamCard {stream} icon={getStreamIcon(stream.userName, streamInfo)} {thumbnailWidth} />
  {/each}
  
  {#if numStreams < streams.length}
    <div class="show-button-container">
      <div class="show-more-divider"></div>
      
      <button class="show-button" on:click={showMoreStreams}>
        Show more
        <img src="/images/chevron-down.svg" alt="Show more" class="show-more-button-icon">
      </button>

      <div class="show-more-divider"></div>
    </div>
  {/if}
</div>

<style>
  .streams-container {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .streams-header {
    font-size: 2.2rem;
    font-weight: 600;
    margin: 20px 0;
    width: 100%;
    color: white;
  }

  :global(.accent) {
    color: var(--clr-accent);
  }

  .show-button-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .show-more-divider {
    height: 2px;
    width: 100%;
    background: var(--clr-primary-light);
  }

  .show-button {
    font-size: 1.4rem;
    color: var(--clr-accent);
    white-space: nowrap;
    padding: 9px 12px;
    margin: 0 10px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    column-gap: 6px;
  }

  .show-button:hover {
    background: var(--clr-primary-light);
  }
</style>