<script>
  import Tooltip from "$lib/components/general/Tooltip.svelte";
  import { onMount } from "svelte";
  import EmoteButton from "./EmoteButton.svelte";
  import SettingsButton from "./SettingsButton.svelte";
  import { browser } from '$app/environment'; 
  import Message from "./Message.svelte";
  import { io } from 'socket.io-client';
  import { pushMax } from '../../utils';

  export let authenticated;
  export let broadcasterId;
  export let channel;
  export let channelEmotes;
  export let globalEmotes;

  let open = true;
  let connected = false;
  let paused = false;

  let chatScroller;
  let scrollButtonHovered = false;

  let messages = [];
  let newMessages = [];
  let maxMessages = 150;

  // join a channel after connecting to chat or navigating to a new channel
  // this will only run in the browser in order to avoid joining chat multiple times (once on server and once on browser)
  $: browser && connected ? joinChat(channel) : null;

  const socket = io();

  socket.on('message', (message) => {
    if (paused) {
      pushMax(newMessages, maxMessages, message);
      newMessages = newMessages;
      return;
    }

    pushMax(messages, maxMessages, message);
    messages = messages;
  });

  function connectChat() {
    try {
      fetch('/api/connectChat', {
        method: 'POST'
      }).then(res => res.text()).then(res => connected = res);
    } catch {
      console.error();
    }
  }

  function disconnectChat() {
    try {
      fetch('/api/disconnectChat', {
        method: 'POST'
      }).then(res => res.text()).then(res => connected = res);
    } catch {
      console.error();
    }
  }

  function joinChat(channel) {
    try {
      fetch('/api/joinChat', {
        method: 'POST',
        body: JSON.stringify({
          broadcasterId: broadcasterId,
          channel: channel
        })
      }).then(res => res.text()).then(res => {
        if (res) {
          messages = [];
        }
      });
    } catch {
      console.error();
    }
  }

  function toggleChat() {
    open = !open;
  }

  function onScroll() {
    const scrollPercent = (Math.abs(chatScroller.scrollTop) / chatScroller.scrollHeight).toFixed(2);
    const minScrollPercent = .05;
    const scrollBottom = 0;

    if (scrollPercent >= minScrollPercent) {
      paused = true;
    } else if (scrollPercent == scrollBottom) {
      pushMax(messages, maxMessages, ...newMessages);
      messages = messages;
      newMessages = [];
      paused = false;
    }
  }

  function scrollToBottom() {
    chatScroller.scrollTo(0, 0);
  }

  onMount(() => {
    connectChat();

    return () => {
      disconnectChat();
      socket.disconnect();
    };
  })
</script>

<div class="chat" class:open>
  {#if open}
    <div class="chat-header">
      <button class="chat-header-button" on:click={toggleChat} aria-describedby="chat-header-collapse-button-tooltip">
        <img src="/images/collapse-expand.svg" alt="Collapse" class="chat-header-button-icon horizontal-flip">
      </button>
      <Tooltip id={'chat-header-collapse-button-tooltip'} text={'Close Chat'} placement={'left'} />

      <div class="chat-header-title">Stream Chat</div>

      <SettingsButton />
    </div>

    <div class="chat-messages-container">
      <div class="chat-messages-scroller" bind:this={chatScroller} on:scroll={onScroll}>
        <div class="chat-messages">
          {#each messages as message, i (i)}
            <Message {message} />
          {/each}
        </div>
      </div>

      <button class="chat-scroll-button" class:hide={!paused} on:click={scrollToBottom} on:mouseenter={() => scrollButtonHovered = true} on:mouseleave={() => scrollButtonHovered = false}>
        {#if scrollButtonHovered}
          <img src="/images/arrow-down.svg" alt="Arrow Down" class="chat-scroll-button-icon">
  
          <div class="chat-scroll-button-text">
            {#if newMessages.length >= 20}
              20+ new messages
            {:else if newMessages.length}
              {newMessages.length} new messages
            {:else}
              See new messages
            {/if}
          </div>
        {:else}
          <img src="/images/pause-small.svg" alt="Chat Paused" class="chat-scroll-button-icon">
  
          <div class="chat-scroll-button-text">
            Chat paused due to scroll
          </div>
        {/if}
      </button>
    </div>

    <div class="chat-footer">
      <div class="chat-input-container">
        <input type="text" class="chat-input" placeholder={authenticated ? 'Send a message' : 'Login to send a message'} disabled={!authenticated}>
        <EmoteButton />
      </div>
    </div>
  {:else}
    <button class="chat-header-button chat-header-expand-button" on:click={toggleChat} aria-describedby="chat-header-expand-button-tooltip">
      <img src="/images/collapse-expand.svg"  alt="Expand" class="chat-header-button-icon">
    </button>
    <Tooltip id={'chat-header-expand-button-tooltip'} text={'Open Chat'} placement={'left'} />
  {/if}
</div>

<style>
  .chat {
    background: var(--clr-primary);
    position: relative;
    display: flex;
    flex-direction: column;
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    border-bottom: 1px solid var(--clr-primary-light);
  }

  .chat-header-button {
    display: flex;
    padding: 7px;
    border-radius: var(--border-radius);
  }

  .chat-header-button:hover {
    background: var(--clr-primary-light);
  }

  .chat-header-expand-button {
    position: absolute;
    right: calc(100% + 10px);
    top: 10px;
  }

  .chat-header-expand-button:hover {
    background: rgba(161, 161, 161, 0.25);
  }

  .chat-header-title {
    font-size: 1.8rem;
    color: white;
  }

  .chat-messages-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    min-height: 0;
    position: relative;
  }

  .chat-messages-scroller {
    display: flex;
    flex-direction: column-reverse;
    overflow-x: hidden;
    overflow-y: scroll;
    height: 100%;
  }

  .chat-messages-scroller::-webkit-scrollbar {
    width: 10px;
  }

  .chat-messages-scroller::-webkit-scrollbar-thumb {
    background: var(--clr-gray);
    border-radius: 100vw;
    border: 2px solid transparent;
    background-clip: padding-box;
  }

  .chat-messages {
    display: flex;
    flex-direction: column;
  }

  .chat-scroll-button {
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    position: absolute;
    padding: 12px 9px;
    border-radius: var(--border-radius);
    display: flex;
    align-items: center;
    white-space: nowrap;
    background: var(--clr-accent);
    width: 210px;
  }

  .chat-scroll-button:hover {
    background: var(--clr-accent-dark);
  }

  .chat-scroll-button-text {
    color: white;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 auto;
  }

  .chat-footer {
    padding: 10px 6px;
  }
  
  .chat-input-container {
    position: relative;
    width: 100%;
  }

  .chat-input {
    background: var(--clr-primary-light);
    border: none;
    color: white;
    font-size: 1.4rem;
    padding: 0 40px 0 10px;
    height: 40px;
    width: 100%;
    border-radius: 3px;
  }

  .chat-input::placeholder {
    color: var(--clr-gray)
  }

  .chat-input:focus {
    outline: 2px solid var(--clr-accent-dark);
  }

  .chat-input:disabled {
    background: var(--clr-primary-dark);
    cursor: not-allowed;
  }

  .horizontal-flip {
    transform: scaleX(-1);
  }

  .open {
    width: var(--chat-width);
  }

  .hide {
    display: none;
  }
</style>