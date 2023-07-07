<script>
  import Tooltip from '../general/Tooltip.svelte';

  export let message;
</script>

<div class="message">
  {#if message.type == 'connect'}
    <span class="message-status">Welcome to the chat room!</span>
  {:else if message.type == 'disconnect'}
    <span class="message-status">Disconnected from the chat room!</span>
  {:else}
    <span class="message-badges">
      {#each message.badges as badge, i (i)}
        <div class="message-badge" aria-describedby="message-badge-tooltip">
          <img src={badge.url} alt={badge.name} class="message-badge-image">
        </div>
        <Tooltip id={"message-badge-tooltip"} text={badge.name} placement={"top"} />
      {/each}
    </span><span class="message-display-name" style={`color: ${message.color}`}>
      {message.displayName}</span><span class="message-text" class:actionMessage={message.type === 'action'}>: 
      {#each message.message as piece, i (i)}
        {#if piece.type === 'emote'}
          <div class="message-emote-container">
            <img src={piece.value.url1X} alt="emote" class="message-emote" aria-describedby="emote-tooltip">
          </div>
          <Tooltip id="emote-tooltip" text={piece.value.emote} placement={'top'} />
        {:else if piece.type === 'url'}
          <a href={piece.value} class="message-url">{piece.value}</a>
        {:else}
          {piece.value}
        {/if}
      {/each}
    </span>
  {/if}
</div>

<style>
  .message {
    padding: 6px 10px;
    font-size: 1.4rem;
    line-height: 2rem;
  }

  .message:hover {
    background: var(--clr-primary-light);
  }

  .message-status {
    color: var(--clr-gray);
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

  .actionMessage {
    color: var(--clr-accent-light);
  }

  .message-emote-container {
    display: inline-block;
    vertical-align: top;
    height: 16px;
    width: 28px;
    position: relative;
  }
  
  .message-emote {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  .message-url {
    color: var(--clr-accent);
    text-decoration: none;
  }

  .message-url:hover {
    color: var(--clr-accent-dark);
    text-decoration: underline;
  }
</style>