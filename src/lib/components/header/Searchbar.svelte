<script>
  import Tooltip from "$lib/components/general/Tooltip.svelte";

  let showSearchbar = false;

  function toggleSearchbar() {
    showSearchbar = !showSearchbar;
  }
</script>

<div class="searchbar-container">
  <button class="search-button" on:click={toggleSearchbar}>
    <img src="/images/search.svg" alt="Search">
  </button>

  <form method="POST" action="" class="search-form" class:hide={!showSearchbar}>
    <input type="text" class="search-input" placeholder="Search">

    <button class="search-form-button" aria-describedby="search-button-tooltip">
      <img src="/images/search.svg" alt="Search">
    </button>
    <Tooltip id={"search-button-tooltip"} text={"Search"} arrow={false} offset={10} />
  </form>
</div>

<style>
  .searchbar-container {
    flex-shrink: 0;
  }
  
  .search-button {
    display: none;
    border-radius: var(--border-radius);
    padding: 6px;
    margin: 0 5px;
  }

  .search-button:hover {
    background: var(--clr-primary-light);
  }

  .search-form {
    position: relative;
    display: flex;
    align-items: center;
    width: 250px;
    margin: 0 10px;
  }

  .search-input {
    background: var(--clr-primary-light);
    color: white;
    font-size: 1.4rem;
    padding: 0 40px 0 10px;
    border-radius: var(--border-radius);
    height: 32px;
    width: 100%;
  }

  .search-input::placeholder {
    color: var(--clr-gray);
  }

  .search-input:focus {
    outline: 2px solid var(--clr-accent-dark);
  }

  .search-form-button {
    padding: 6px;
    border-radius: var(--border-radius);
    position: absolute;
    right: 0;
    display: flex;
  }

  .search-form-button:hover {
    background: var(--clr-accent-dark);
  }

  .hide {
    display: none;
  }
</style>