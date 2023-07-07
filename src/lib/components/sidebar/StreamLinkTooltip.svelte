<script>
  import { formatCount } from '$lib/utils.js';
  import { computePosition, shift, offset, autoUpdate } from '@floating-ui/dom';
  import { onMount } from 'svelte';

  export let id;
  export let stream;
  export let sidebarOpen;

  let tooltip;
  let referenceElement;
  let eventListeners = {
    'mouseenter': showTooltip,
    'mouseleave': hideTooltip,
    'focus': showTooltip,
    'blur': hideTooltip
  };

  onMount(() => {
    referenceElement = tooltip.previousElementSibling;

    const cleanupAutoUpdate = autoUpdate(referenceElement, tooltip, updatePosition, {
      ancestorResize: false,
      elementResize: false
    });

    for (const [event, listener] of Object.entries(eventListeners)) {
      referenceElement.addEventListener(event, listener);
    }

    return () => {
      for (const [event, listener] of Object.entries(eventListeners)) {
        referenceElement.removeEventListener(event, listener);
      }

      cleanupAutoUpdate();
    };
  });

  function showTooltip() {
    tooltip.style.display = 'flex';
    updatePosition();
  }

  function hideTooltip() {
    tooltip.style.display = '';
  }

  function updatePosition() {
    computePosition(referenceElement, tooltip, {
      placement: 'right-start',
      middleware: [offset(10), shift()]
    }).then(({x, y}) => {
      Object.assign(tooltip.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
</script>

<div class="stream-link-tooltip" {id} role="tooltip" bind:this={tooltip}>
  <div class="stream-name-and-category" class:hide={sidebarOpen}>{stream.userName} ∙ {stream.gameName}</div>

  <div class="stream-title">{stream.title ? stream.title : 'No stream title'}</div>

  <div class="stream-viewercount" class:hide={sidebarOpen}>
    <div class="stream-live-icon"></div>
    Live | {formatCount(stream.viewerCount)} viewers
  </div>
</div>

<style>
  .stream-link-tooltip {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
    width: max-content;
    max-width: 210px;
    background: var(--clr-primary);
    border-radius: var(--border-radius);
    font-size: 1.4rem;
    padding: 6px;
    flex-direction: column;
    row-gap: 3px;
    border: 1px solid var(--clr-primary-light);
    z-index: 999;
    user-select: none;
  }

  .stream-name-and-category {
    color: var(--clr-accent);
    line-height: normal;
  }

  .stream-title {
    color: white;
    line-height: normal;
    overflow-wrap: anywhere;
  }

  .stream-viewercount {
    display: flex;
    align-items: center;
    column-gap: 5px;
    color: var(--clr-gray);
  }

  .stream-live-icon {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--clr-red);
  }

  .hide {
    display: none;
  }
</style>