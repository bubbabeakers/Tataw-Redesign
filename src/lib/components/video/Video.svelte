<script>
  import LiveTag from "../general/LiveTag.svelte";
import ClipButton from "./ClipButton.svelte";
  import FullscreenButton from "./FullscreenButton.svelte";
  import PlayPauseButton from "./PlayPauseButton.svelte";
  import SettingsButton from "./SettingsButton.svelte";
  import SoundButtonAndSlider from "./SoundButtonAndSlider.svelte";

  export let channel = null;
  export let video = null;
  export let collection = null;
  export let broadcasterId;

  let videoNode;
  let videoId = 'video';
  let player;
  let volume = 0;
  let quality = 'auto';
  let settings = false;
  let paused = false;
  let ready = false;
  let overlay = true;
  let overlayTimeout = setTimeout(() => hideOverlay(), 5 * 1000);

  // create AbortController for easy event listener removal
  const controller = new AbortController();
  const signal = controller.signal;

  // update the player quality everytime the quality changes
  $: player?.setQuality(quality);

  // update the player volume everytime the volume changes
  $: if (player && volume) {
    if (player.getMuted()) {
      player.setMuted(false);
    }

    player.setVolume(volume);
  } else if (player) {
    player.setMuted(true);
  }

  function onMount() {
    function initPlayer() {
      player = embed.getPlayer();
      quality = player.getQuality();
    }

    let playerOptions = {
      width: 400,
      height: 300,
      channel: channel,
      video: video,
      collection: collection,
      layout: 'video',
      controls: false,
      autoplay: true,
      muted: !Boolean(volume)
    };

    // create new twitch embed and attach it to the playerID
    let embed = new Twitch.Embed(videoId, playerOptions);
    
    // add event listeners for twitch embed and player
    embed.addEventListener(Twitch.Embed.VIDEO_READY, initPlayer, {signal});
    embed.addEventListener(Twitch.Player.PLAY, play, {signal});
    embed.addEventListener(Twitch.Player.PAUSE, pause, {signal});

    return {
      destroy() {
        // remove all event listeners attached to the abort controller
        controller.abort();
      }
    };
  }

  function play() {
    ready = true;
    paused = false;
  }

  function pause() {
    paused = true;
  }

  function showOverlay() {
    overlay = true;
  }

  function hideOverlay() {
    overlay = false;
  }

  function onMouseenter() {
    showOverlay();
  }

  function onMouseleave() {
    clearTimeout(overlayTimeout);
    hideOverlay();
  }

  function onMousemove() {
    clearTimeout(overlayTimeout);
    
    if (paused) {
      return;
    }

    showOverlay();

    overlayTimeout = setTimeout(() => hideOverlay(), 5 * 1000);
  }

  function toggleVideoState() {
    if (paused) {
      player.play();
    } else {
      player.pause();
    }
  }

  function getQualities() {
    return player.getQualities() || [];
  }

  function getPlaybackStats() {
    return player.getPlaybackStats() || [];
  }
</script>

{#key channel}
  <div bind:this={videoNode} id={videoId} class="video-container" use:onMount on:mouseenter={onMouseenter} on:mouseleave={onMouseleave} on:mousemove={onMousemove} on:dblclick={toggleVideoState}>
    <div class="overlay">
      {#if (overlay || paused || settings) && ready}
        <div class="overlay-header">
          <LiveTag />
        </div>

        <div class="overlay-controls">
          <PlayPauseButton {paused} {toggleVideoState} />
          <SoundButtonAndSlider bind:volume />
          <SettingsButton bind:settings bind:quality qualities={getQualities()} {getPlaybackStats} />
          <ClipButton {broadcasterId} />
          <FullscreenButton {videoNode} />
        </div>
      {/if}
    </div>
  </div>
{/key}

<style>
  .video-container {
    position: relative;
    user-select: none;
  }

  :global(.video-container > iframe) {
    aspect-ratio: 16 / 9;
    border: none;
    width: 100%;
    height: 100%;
  }

  .overlay {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .overlay-header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    padding: 14px 40px;
    background: linear-gradient(180deg,rgba(0, 0, 0, .8) 0,rgba(0, 0, 0, .35) 60%, transparent);
    display: flex;
    justify-content: flex-end;
  }

  .overlay-controls {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    column-gap: 6px;
    background: linear-gradient(0deg,rgba(0, 0, 0, .8) 0,rgba(0, 0, 0, .35) 60%, transparent);
    padding: 10px 16px;
  }

  :global(.video-control-button) {
    padding: 6px;
    display: flex;
    border-radius: var(--border-radius);
    user-select: none;
  }

  :global(.video-control-button:hover) {
    background: rgba(161, 161, 161, 0.25);
  }
</style>