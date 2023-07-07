<script>
  import RadioInput from "../general/RadioInput.svelte";
  import Tooltip from "../general/Tooltip.svelte";
  import { computePosition, flip, offset, autoUpdate } from "@floating-ui/dom";

  export let settings;
  export let quality;
  export let qualities;
  export let getPlaybackStats;

  let stats = getPlaybackStats();
  let currentSetting = null;
  let settingsNode;
  let menuNode;

  // update qualityName everytime the quality changes
  $: qualityName = qualities.find(q => q.group == quality).name || 'Auto';

  function updatePosition() {
    computePosition(settingsNode, menuNode, {
      placement: 'top-end',
      middleware: [offset(10), flip()]
    }).then(({x, y}) => {
      Object.assign(menuNode.style, {
        left: `${x}px`,
        top: `${y}px`
      });
    });
  }

  function menuOnMount(el) {
    menuNode = el;
    let statsInterval = setInterval(() => stats = getPlaybackStats(), 1000);

    document.addEventListener('click', menuOnClick, { capture: true });

    const cleanupAutoUpdate = autoUpdate(settingsNode, menuNode, updatePosition);

    return {
      destroy() {
        clearInterval(statsInterval);
        cleanupAutoUpdate();
        document.removeEventListener('click', menuOnClick, { capture: true });
      }
    };
  }

  function menuOnClick(event) {
    let clickInside = settingsNode.contains(event.target);

    if (!clickInside) {
      toggleSettings();
    }
  }

  function openSetting(setting) {
    currentSetting = setting;
  }

  function toggleSettings() {
    if (settings) {
      settings = false;
      currentSetting = null;
    } else {
      settings = true;
    }
  }
</script>

<div class="video-control-button-container" bind:this={settingsNode} on:dblclick|stopPropagation>
  <button class='video-control-button' on:click={toggleSettings} aria-describedby="video-control-button-tooltip">
    <img src="/images/settings-large.svg" alt="Settings" class="video-control-button-icon">
  </button>

  <Tooltip text={'Settings'} placement={'top'} id={'video-control-button-tooltip'} />

  {#if settings}
    <div class="settings-menu" use:menuOnMount tabindex="-1">
      <div class="settings-header">
        {#if currentSetting}
          <button class="settings-header-button" on:click={() => openSetting(null)}>
            <img src="/images/chevron-left.svg" alt="Back">
            Back
          </button>
        {/if}

        <button class="settings-header-button close-button" on:click={toggleSettings}>
          Close
          <img src="/images/x.svg" alt="Close">
        </button>
      </div>

      {#if currentSetting == 'quality'}
        <div class="settings-subheader">VIDEO QUALITY</div>

        {#each qualities as q, i (i)}
          <div class="settings-row">
            <RadioInput id={`quality-option-${i + 1}`} value={q.group} bind:group={quality} labelName={q.name} />
          </div>
        {/each}
      {:else if currentSetting == 'stats'}
        <div class="settings-subheader">VIDEO STATS</div>

        <div class="settings-row">
          <div class="settings-column">Video Resolution</div>
          <div class="settings-column">{stats.videoResolution}</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">Display Resolution</div>
          <div class="settings-column">{stats.displayResolution}</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">FPS</div>
          <div class="settings-column">{stats.fps}</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">Skipped Frames</div>
          <div class="settings-column">{stats.skippedFrames}</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">Buffer Size</div>
          <div class="settings-column">{stats.bufferSize.toFixed(2)} sec</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">Playback Bitrate</div>
          <div class="settings-column">{stats.playbackRate} Kbps</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">Latency to Broadcaster</div>
          <div class="settings-column">{stats.hlsLatencyBroadcaster} sec</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">Latency Mode</div>
          <div class="settings-column">{stats.latencyMode}</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">Codecs</div>
          <div class="settings-column">{stats.codecs.replace(',', ', ')}</div>
        </div>
        <div class="settings-row">
          <div class="settings-column">Backend Version</div>
          <div class="settings-column">{stats.backendVersion}</div>
        </div>
      {:else}
        <div class="settings-row">
          <div class="settings-label">Quality</div>
          <div class="settings-value">{qualityName}</div>
          <button class="settings-row-button" on:click={() => openSetting('quality')}>
            <img src="/images/chevron-right.svg" alt="Quality Settings">
          </button>
        </div>
        <div class="settings-row">
          <div class="settings-label">Video Stats</div>
          <button class="settings-row-button" on:click={() => openSetting('stats')}>
            <img src="/images/chevron-right.svg" alt="Video Stats">
          </button>
        </div>
      {/if}
    </div>
  {/if}
</div>

<style>
  .video-control-button-container {
    position: relative;
  }
  
  :global(.video-control-button:hover > .tooltip) {
    display: block;
  }

  .settings-menu {
    position: absolute;
    top: 0;
    left: 0;
    width: 230px;
    background: var(--clr-primary);
    border: 1px solid var(--clr-primary-light);
    color: white;
    font-size: 1.4rem;
    padding: 6px;
    border-radius: var(--border-radius);
    z-index: 999;
  }

  .settings-header {
    display: flex;
    padding-bottom: 10px;
  }

  .settings-header-button {
    column-gap: 10px;
    display: flex;
    align-items: center;
    padding: 9px 12px;
    border-radius: var(--border-radius);
    color: white;
  }

  .settings-header-button:hover {
    background: rgba(161, 161, 161, 0.25);
  }

  .close-button {
    margin-left: auto;
  }

  .settings-row-button {
    display: flex;
    padding: 6px;
    border-radius: var(--border-radius);
  }

  .settings-row-button:hover {
    background: rgba(161, 161, 161, 0.25);
  }

  .settings-subheader {
    color: var(--clr-gray);
    padding-bottom: 10px;
  }

  .settings-row {
    display: flex;
    align-items: center;
    column-gap: 10px;
    padding: 5px 0;
  }

  .settings-column {
    width: 50%;
    word-wrap: break-word;
  }

  .settings-label {
    margin-right: auto;
  }
</style>