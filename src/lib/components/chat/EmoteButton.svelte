<script>
  let emoteButtonContainer;
  let showMenu = false;

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function menuOnMount() {
    document.addEventListener('click', menuOnClick, { capture: true });

    return {
      destroy() {
        document.removeEventListener('click', menuOnClick, { capture: true });
      }
    };
  }

  function menuOnClick(event) {
    let clickInside = emoteButtonContainer.contains(event.target);

    if (!clickInside) {
      toggleMenu();
    }
  }
</script>

<div class="emote-button-container" bind:this={emoteButtonContainer}>
  <button class="emote-button" on:click={toggleMenu}>
    <img src="/images/emote.svg" alt="Emote" class="emote-button-image">
  </button>

  {#if showMenu}
    <div class="emote-menu" use:menuOnMount tabindex="-1">
      
    </div>
  {/if}
</div>

<style>
  .emote-button-container {
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
  }

  .emote-button {
    padding: 7px;
    border-radius: var(--border-radius);
    display: flex;
  }

  .emote-button:hover {
    background: var(--clr-accent-dark);
  }

  .emote-menu {
    position: absolute;
    bottom: calc(100% + 10px);
    right: 0;
    width: 200px;
    background: var(--clr-primary);
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }
</style>