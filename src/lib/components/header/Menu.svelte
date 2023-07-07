<script>
  import { page } from '$app/stores'; 

  export let user;

  let showMenu = false;
  let menuContainer;

  function toggleMenu() {
    showMenu = !showMenu;
  }

  function menuOnClick(event) {
    let clickInside = menuContainer.contains(event.target);
    let isLink = event.target.classList.contains('menu-link');

    if (!clickInside || isLink) {
      toggleMenu();
    }
  }

  function menuOnMount() {
    document.addEventListener('click', menuOnClick, { capture: true });

    return {
      destroy() {
        document.removeEventListener('click', menuOnClick, { capture: true });
      }
    };
  }
</script>

<div class="menu-container" bind:this={menuContainer}>
  <button class="menu-button" on:click={toggleMenu}>
    <img src="/images/menu.svg" alt="Menu" class="menu-button-icon">
  </button>

  {#if showMenu}
    <div class="menu" use:menuOnMount tabindex="-1">
      <a href="/" class="menu-link" class:active={$page.url.pathname == '/'}>Home</a>

      {#if user}
        <a href="/directory/following" class="menu-link" class:active={$page.url.pathname == '/directory/following'}>Following</a>
      {/if}
      
      <a href="/directory" class="menu-link" class:active={/^\/directory(?:\/|$)(?!following(\/|$))/.test($page.url.pathname)}>Browse</a>
    </div>
  {/if}
</div>

<style>
  .menu-container {
    position: relative;
    display: none;
    z-index: 1;
  }

  .menu-button {
    padding: 17px;
    display: flex;
  }

  .menu-button:hover {
    background: var(--clr-primary-light);
  }

  .menu {
    position: absolute;
    top: 100%;
    left: 0;
    display: flex;
    flex-direction: column;
    background: var(--clr-primary);
    width: 210px;
    border-radius: var(--border-radius);
    z-index: 999;
    padding: 6px;
    border: 1px solid var(--clr-primary-light);
  }

  .menu-link {
    font-size: 1.6rem;
    text-decoration: none;
    color: var(--clr-gray);
    font-weight: 600;
    padding: 12px 15px;
    width: 100%;
    border-radius: var(--border-radius);
  }

  .menu-link:hover {
    background: var(--clr-primary-light);
  }

  .active {
    color: var(--clr-accent);
  }
</style>