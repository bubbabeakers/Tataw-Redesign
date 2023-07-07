<script>
  import { onMount } from "svelte";
  import { formatTime } from "../../utils";

  export let startTime;

  let seconds = Math.floor((Date.now() - Date.parse(startTime)) / 1000);

  $: uptime = formatTime(seconds);

  onMount(() => {
    const interval = setInterval(() => {
      seconds += 1;
    }, 1000);

    return () => clearInterval(interval);
  });
</script>

<div class="uptime">{uptime}</div>

<style>
  .uptime {
    color: white;
    font-size: 1.4rem;
  }
</style>