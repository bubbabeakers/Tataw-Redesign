<script>
  export let loginUrl;
  export let signupUrl;
  export let toggleModal;

  let modal;

  function onClick(event) {
    if (event.target === modal) {
      toggleModal();
    }
  }
</script>

<div class="modal-container" on:click={onClick} on:keypress bind:this={modal}>
  <div class="modal">
    <div class="modal-header">
      <button class="close-button" on:click={toggleModal}>
        <img src="/images/x.svg" alt="Close" class="close-button-icon">
      </button>
    </div>

    <div class="modal-body">
      <h1 class="welcome-message">Welcome,</h1>

      To get started, please login to your Twitch account or create a new one
      
      <div class="modal-buttons-container">
        <button class="modal-button" on:click={()=> window.open(loginUrl, '_parent')}>
          <img src="/images/twitch.svg" alt="Login" class="modal-button-icon">
          Login
        </button>
        or
        <button class="modal-button" on:click={()=> window.open(signupUrl, '_blank')}>
          <img src="/images/twitch.svg" alt="Login" class="modal-button-icon">
          Sign Up
        </button>
      </div>
    </div>
  </div>
</div>

<style>
  .modal-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 999;
  }

  .modal {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: var(--clr-primary);
    border: 2px solid var(--clr-primary-light);
    border-radius: var(--border-radius);
    padding: 6px;
    display: flex;
    flex-direction: column;
    width: 350px;
  }

  .modal-header {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }

  .close-button {
    padding: 6px;
    border-radius: var(--border-radius);
    display: flex;
  }

  .close-button:hover {
    background: var(--clr-primary-light);
  }

  .modal-body {
    display: flex;
    flex-direction: column;
    align-items: center;
    color: var(--clr-gray);
    font-size: 1.4rem;
    padding: 0 20px;
    text-align: center;
    row-gap: 20px;
    line-height: 1.4;
    margin: 10px 0;
  }

  .welcome-message {
    font-size: 2.4rem;
    color: white;
    margin: 0;
  }

  .modal-buttons-container {
    color: var(--clr-gray);
    font-size: 1.4rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    row-gap: 8px;
  }

  .modal-button {
    padding: 9px 12px;
    background: var(--clr-accent);
    border-radius: var(--border-radius);
    color: white;
    font-weight: 600;
    font-size: 1.8rem;
    display: flex;
    align-items: center;
    column-gap: 6px;
    width: 120px;
  }

  .modal-button:hover {
    background: var(--clr-accent-dark);
  }
</style>