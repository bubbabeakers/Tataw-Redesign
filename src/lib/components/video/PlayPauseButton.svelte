<script>
  import Tooltip from "../general/Tooltip.svelte";

  export let paused;
  export let toggleVideoState;
</script>

<div class="video-control-button-container">
  <button class="video-control-button" on:click={toggleVideoState} aria-describedby="video-control-button-tooltip">
    {#if paused}
      <img src="/images/play.svg" alt="Play Icon" class="video-control-button-icon">
    {:else}
      <img src="/images/pause.svg" alt="Pause Icon" class="video-control-button-icon">
    {/if}
  </button>

  <Tooltip text={paused ? 'Play' : 'Pause'} placement={'top'} id={'video-control-button-tooltip'} />
</div>

<style>
  :global(.video-control-button:hover > .tooltip) {
    display: block;
  }
</style>