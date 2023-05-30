<script>
  import Tooltip from '../general/Tooltip.svelte';

  export let message;

  // implement a way to resolve message.message.emotes before displaying a message
  // maybe an await block could work

  function formatMessage(message) {
    // console.log(message.text, message.emotes);

    return message.text;
  }
</script>

<div class="message">
  {#if message.type == 'connect'}
    <span class="message-status">Welcome to the chat room!</span>
  {:else if message.type == 'disconnect'}
    <span class="message-status">Disconnected from the chat room!</span>
  {:else}
    <span class="message-badges">
      {#each message.user.badges as badge, i (i)}
        <div class="message-badge" aria-describedby="message-badge-tooltip">
          <img src={badge.url} alt={badge.title} class="message-badge-image">
        </div>
        <Tooltip id={"message-badge-tooltip"} text={badge.title} placement={"top"} />
      {/each}
    </span><span class="message-display-name" style={`color: ${message.user.color}`}>{message.user.displayName}</span><span class="message-text">: {formatMessage(message.message)}</span>
  {/if}
</div>

<style>
  .message {
    padding: 6px 10px;
    font-size: 1.4rem;
    line-height: 2rem;
  }

  .message-status {
    color: var(--clr-gray-dark);
  }

  .message-badges {
    display: inline-flex;
  }

  .message-badge {
    width: 18px;
    height: 18px;
    position: relative;
    margin-right: 4px;
  }
  
  .message-badge-image {
    vertical-align: middle;
    padding-bottom: 1px;
  }

  :global(.message-badge-image:hover > .tooltip) {
    display: block;
  }
  
  .message-display-name {
    font-weight: 600;
  }
  
  .message-text {
    color: white;
    overflow-wrap: anywhere;
  }
</style>