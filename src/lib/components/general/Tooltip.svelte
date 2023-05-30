<script>
  import { computePosition, shift, offset as _offset, arrow as _arrow } from '@floating-ui/dom';
  import { onMount } from 'svelte';

  export let id;
  export let text;
  export let offset = 15;
  export let placement = 'bottom';
  export let arrow = true;

  let tooltip;
  let referenceElement;
  let arrowElement;
  let eventListeners = {
    'mouseenter': showTooltip,
    'mouseleave': hideTooltip,
    'focus': showTooltip,
    'blur': hideTooltip
  };

  onMount(() => {
    referenceElement = tooltip.previousElementSibling;

    for (const [event, listener] of Object.entries(eventListeners)) {
      referenceElement.addEventListener(event, listener);
    }
    
    return () => {
      for (const [event, listener] of Object.entries(eventListeners)) {
        referenceElement.removeEventListener(event, listener);
      }
    };
  });

  function showTooltip() {
    tooltip.style.display = 'block';
    updatePosition();
  }

  function hideTooltip() {
    tooltip.style.display = '';
  }

  function updatePosition() {
    computePosition(referenceElement, tooltip, {
      placement: placement,
      middleware: [
        _offset(offset),
        shift(),
        _arrow({element: arrowElement})
      ]
    }).then(({x, y, placement, middlewareData}) => {
      Object.assign(tooltip.style, {
        left: `${x}px`,
        top: `${y}px`
      });

      if (!arrow) {
        return;
      }

      const {x: arrowX, y: arrowY} = middlewareData.arrow;

      const staticSide = {
        top: 'bottom',
        right: 'left',
        bottom: 'top',
        left: 'right',
      }[placement.split('-')[0]];
    
      Object.assign(arrowElement.style, {
        left: arrowX != null ? `${arrowX}px` : '',
        top: arrowY != null ? `${arrowY}px` : '',
        right: '',
        bottom: '',
        [staticSide]: '-3px',
      });
    });
  }
</script>

<div class="tooltip" {id} role="tooltip" bind:this={tooltip}>
  {text}
  {#if arrow}
    <div class="tooltip-arrow" bind:this={arrowElement}></div>
  {/if}
</div>

<style>
  .tooltip {
    display: none;
    width: max-content;
    position: fixed;
    top: 0;
    left: 0;
    color: black;
    font-size: 1.4rem;
    font-weight: 600;
    padding: 5px;
    border-radius: var(--border-radius);
  }

  .tooltip-arrow {
    position: absolute;
    width: 6px;
    height: 6px;
    transform: rotate(45deg);
  }

  .tooltip,
  .tooltip-arrow {
    background: white;
  }
</style>