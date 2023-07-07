<script>
  import Header from "$lib/components/header/Header.svelte";
  import Sidebar from "$lib/components/sidebar/Sidebar.svelte";

  export let data;
</script>

<div class="layout-container">
  <Header user={data.user} loginUrl={data.loginUrl} signupUrl={data.signupUrl} />
  <Sidebar authenticated={Boolean(data.user)} streams={data.user ? data.followedStreams : data.topStreams} streamInfo={data.streamInfo} />
  <slot />
</div>

<style>
  .layout-container {
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr;
    height: 100%
  }

  :global(.layout-container > *) {
    min-height: 0;
  }

  :global(.layout-container > *:first-child) {
    grid-column: span 2;
  }
</style>