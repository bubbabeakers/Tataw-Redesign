<script>
  import StreamCollection from "../lib/components/general/StreamCollection.svelte";

  export let data;
</script>

<div class="page-content">
  <StreamCollection title={'<span class="accent">Top streams</span> picked just for you'} streams={data.topStreams} streamInfo={data.streamInfo} />
</div>

<style>
  .page-content {
    padding: 0 20px 20px 20px;
    overflow: auto;
  }
  .page-content::-webkit-scrollbar {
    width: 10px;
  }

  .page-content::-webkit-scrollbar-thumb {
    background: var(--clr-gray);
    border-radius: 100vw;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
</style>