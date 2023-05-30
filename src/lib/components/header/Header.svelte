<script>
  import { page } from '$app/stores';
  import Menu from "$lib/components/header/Menu.svelte";
  import Searchbar from "$lib/components/header/Searchbar.svelte";
  import Avatar from "$lib/components/header/Avatar.svelte";

  export let user;
  export let loginUrl;
  export let signupUrl;
</script>

<header class="header">
  <nav class="header-left">
    <Menu {user} />

    <a href="/" class="header-nav-link" class:active={$page.url.pathname == '/'}>Home</a>
    {#if user}
      <a href="/directory/following" class="header-nav-link" class:active={$page.url.pathname == '/directory/following'}>Following</a>
    {/if}
    <a href="/directory" class="header-nav-link" class:active={/^\/directory(?:\/|$)(?!following(\/|$))/.test($page.url.pathname)}>Browse</a>
  </nav>

  <Searchbar />

  <div class="header-right">
    {#if user}
      <div class="header-text">{user.displayName}</div>
      <Avatar {user} />
    {:else}
      <div class="header-auth-container">
        <a href={loginUrl} class="header-auth-link">Login</a>
        <div class="header-text">or</div>
        <a href={signupUrl} class="header-auth-link">Sign Up</a>
      </div>
    {/if}
  </div>
</header>

<style>
  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 9px 30px;
    width: 100%;
    background: var(--clr-primary);
    border-bottom: 2px solid var(--clr-primary-light);
    position: relative;
  }

  .header-left,
  .header-right {
    flex: 1;
  }

  .header-left {
    display: flex;
    align-items: center;
    column-gap: 50px;
  }

  .header-nav-link {
    font-size: 1.8rem;
    text-decoration: none;
    color: var(--clr-gray);
    font-weight: 600;
    padding: 7px;
  }

  .header-nav-link:hover {
    color: var(--clr-accent-dark);
  }

  .header-right {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    font-size: 1.4rem;
    column-gap: 10px;
  }

  .header-text {
    color: var(--clr-gray);
  }

  .header-auth-container {
    display: flex;
    align-items: center;
    column-gap: 8px;
  }

  .header-auth-link {
    background: var(--clr-accent);
    font-weight: 600;
    padding: 9px 12px;
    border-radius: var(--border-radius);
    color: white;
    white-space: nowrap;
    text-decoration: none;
  }

  .header-auth-link:hover {
    background: var(--clr-accent-dark);
  }

  .active {
    color: var(--clr-accent);
  }

  @media screen and (max-width: 1049px) {
    .header {
      padding: 0;
    }

    .header-left {
      flex: 0;
    }

    :global(.header-left .menu-container) {
      display: block;
    }

    .header-nav-link {
      display: none;
    }

    :global(.header-right > .avatar-container),
    .header-auth-container {
      margin-right: 10px;
    }
  }

  @media screen and (min-width: 550px) {
    :global(.header > .searchbar-container > .search-form) {
      display: flex;
    }
  }

  @media screen and (max-width: 549px) {
    :global(.header > .searchbar-container > .search-button) {
      display: flex;
    }

    :global(.header > .searchbar-container > .search-form) {
      position: absolute;
      top: calc(100% + 10px);
      left: 0;
      right: 0;
      z-index: 99;
      width: auto;
    }
  }
</style>