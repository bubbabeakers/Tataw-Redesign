<script>
  import Tooltip from "../general/Tooltip.svelte";

  export let videoNode;
  
  let fullscreen = false;

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => console.error(err));
      fullscreen = false;
    } else {
      videoNode.requestFullscreen().catch(err => console.error(err));
      fullscreen = true;
    }
  }
</script>

<div class="video-control-button-container">
  <button class="video-control-button" on:click={toggleFullscreen} on:dblclick|stopPropagation aria-describedby="video-control-button-tooltip">
    {#if fullscreen}
      <img src="/images/fullscreen-minimize.svg" alt="Close Fullscreen" class="video-control-button-icon">
    {:else}
      <img src="/images/fullscreen.svg" alt="Fullscreen" class="video-control-button-icon">
    {/if}
  </button>

  <Tooltip text={fullscreen ? 'Minimize' : 'Fullscreen'} placement={'top'} id={'video-control-button-tooltip'} />
</div>

<style>
  :global(.video-control-button:hover > .tooltip) {
    display: block;
  }
</style>