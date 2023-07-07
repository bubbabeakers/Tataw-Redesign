<script>
  export let user;

  let avatarContainer;
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
    let clickInside = avatarContainer.contains(event.target);
    let isLink = event.target.classList.contains('menu-link');

    if (!clickInside || isLink) {
      toggleMenu();
    }
  }

  async function logout() {
    let response = await fetch('/api/logout', {
      method: 'POST'
    });

    if (response.ok) {
      window.location.reload();
    }
  }
</script>

<div class="avatar-container" bind:this={avatarContainer}>
  <button class="avatar-button" on:click={toggleMenu}>
    <img src={user.profileImageUrl} alt="Avatar" class="avatar-image">
  </button>

  {#if showMenu}
    <div class="menu" use:menuOnMount tabindex="-1">
      <div class="menu-header">
        <img src={user.profileImageUrl} alt="User" class="avatar-image">
        {user.displayName}
      </div>

      <a href={`/${user.displayName}`} class="menu-link">
        <img src="/images/user.svg" alt="User" class="menu-link-image">
        My Channel
      </a>

      <div class="menu-footer">
        <button class="menu-button" on:click={logout}>Log Out</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .avatar-container {
    position: relative;
  }

  .avatar-button {
    display: flex;
  }

  .avatar-image {
    width: 30px;
    height: 30px;
    border-radius: 50%;
  }

  .menu {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    width: 210px;
    background: var(--clr-primary);
    border-radius: var(--border-radius);
    z-index: 999;
    display: flex;
    flex-direction: column;
    border: 1px solid var(--clr-primary-light);
    font-size: 1.4rem;
    padding: 6px;
  }

  .menu-header {
    display: flex;
    align-items: center;
    column-gap: 10px;
    padding: 15px 10px;
    color: white;
  }

  .menu-link {
    padding: 13px 10px;
    text-decoration: none;
    color: var(--clr-gray);
    display: flex;
    align-items: center;
    column-gap: 5px;
    border-radius: var(--border-radius);
  }

  .menu-link:hover {
    background: var(--clr-primary-light);
  }

  .menu-footer {
    margin-top: 6px;
    display: flex;
    justify-content: flex-end;
  }

  .menu-button {
    background: var(--clr-accent);
    font-size: 1.3rem;
    font-weight: 600;
    padding: 9px 12px;
    border-radius: var(--border-radius);
    color: white;
    white-space: nowrap;
  }

  .menu-button:hover {
    background: var(--clr-accent-dark);
  }
</style>