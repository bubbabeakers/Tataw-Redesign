<script>
  import Tooltip from "../general/Tooltip.svelte";

  export let broadcasterId;

  async function createClip() {
    let clipUrl = await fetch('/api/clip', {
      method: 'POST',
      body: broadcasterId
    }).then(res => res.text())

    // open clip url in a new tab
    window.open(clipUrl, '_blank');
  }
</script>

<div class="video-control-button-container">
  <button class="video-control-button" on:click={createClip} on:dblclick|stopPropagation aria-describedby="video-control-button-tooltip">
    <img src="/images/clip.svg" alt="Clip" class="video-control-button-icon">
  </button>
  
  <Tooltip text={'Clip'} placement={'top'} id={'video-control-button-tooltip'} />
</div>

<style>
  :global(.video-control-button:hover > .tooltip) {
    display: block;
  }
</style>