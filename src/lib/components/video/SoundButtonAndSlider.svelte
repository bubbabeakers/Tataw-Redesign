<script>
  import Tooltip from "../general/Tooltip.svelte";
  import RangeSlider from 'svelte-range-slider-pips';

  export let volume;

  let lastVolume = .5;

  function toggleMute() {
    if (volume) {
      lastVolume = volume;
      volume = 0;
    } else {
      volume = lastVolume;
    }
  }
</script>

<div class="video-control-button-container" on:dblclick|stopPropagation>
  <button class='video-control-button' on:click={toggleMute} aria-describedby="video-control-button-tooltip">
    {#if volume}
      <img src="/images/sound.svg" alt="Sound" class="video-control-button-icon">
    {:else}
      <img src="/images/sound-muted.svg" alt="Muted" class="video-control-button-icon">
    {/if}
  </button>
  
  <Tooltip text={volume ? 'Mute' : 'Unmute'} placement={'top'} id={'video-control-button-tooltip'}/>

  <RangeSlider on:start={(e) => lastVolume = e.detail.value} on:change={(e) => volume = e.detail.value} range={'min'} min={0} max={1} step={.01} values={[volume]} float formatter={(_, __, p) => p} suffix={'%'} id={'video-volume-slider'} />
</div>

<style>
  .video-control-button-container {
    display: flex;
    align-items: center;
    column-gap: 5px;
    margin-right: auto;
  }

  :global(.video-control-button:hover > .tooltip) {
    display: block;
  }

  :global(#video-volume-slider) {
    --range-slider: rgba(161, 161, 161, 0.25);
    --range-handle-inactive: white;
    --range-handle: white;
    --range-handle-focus: white;
    --range-handle-border: var(--clr-gray);
    --range-range-inactive: white;
    --range-range: white;
    --range-float-text: black;
    width: 110px;
    height: 4px;
    margin: 10px 8px;
  }

  :global(#video-volume-slider .rangeFloat) {
    font-size: 1.2rem;
    line-height: 1;
    padding: 5px;
  }

  :global(#video-volume-slider .rangeNub) {
    border-radius: 10em;
    transform: translate(0);
  }

  :global(#video-volume-slider .rangeHandle:focus-visible) {
    outline: 2px solid white;
  }
</style>