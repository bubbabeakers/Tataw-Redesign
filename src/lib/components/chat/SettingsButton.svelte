<script>
  import Tooltip from '$lib/components/general/Tooltip.svelte'; 

  let settingsButtonContainer;
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
    let clickInside = settingsButtonContainer.contains(event.target);

    if (!clickInside) {
      toggleMenu();
    }
  }
</script>

<div class="settings-button-container" bind:this={settingsButtonContainer}>
  <button class="settings-button" on:click={toggleMenu} aria-describedby="chat-settings-button-tooltip">
    <img src="/images/settings.svg" alt="settings" class="settings-button-image">
  </button>
  <Tooltip id={"chat-settings-button-tooltip"} text={"Settings"} placement={"left"} />

  {#if showMenu}
    <div class="settings-menu" use:menuOnMount tabindex="-1">
      
    </div>
  {/if}
</div>

<style>
  .settings-button-container {
    position: relative;
  }

  .settings-button {
    padding: 7px;
    border-radius: var(--border-radius);
    display: flex;
  }

  .settings-button:hover {
    background: var(--clr-primary-light);
  }

  .settings-menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 200px;
    background: var(--clr-primary);
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
  }
</style>