<script>
  export let value;
  export let group;
  export let labelName;
  export let id;
</script>

<div class="radio">
  <input type="radio" {id} {value} bind:group={group} {...$$restProps}>
  <label for={id}>{labelName}</label>
</div>

<style>
  .radio {
    margin-left: 0.125em;
  }

  .radio label {
    position: relative;
    padding-left: 1.5em;
    cursor: pointer;
  }

  .radio label::before {
    content: '';
    width: 16px;
    height: 16px;
    position: absolute;
    top: 2px;
    left: -1px;
    border-radius: 50%;
    box-shadow: inset 0 0 0 2px var(--clr-accent);
  }

  input[type='radio'] {
    position: absolute;
    visibility: hidden;
  }

  input[type='radio']:checked~label::after {
    content: '';
    width: 8px;
    height: 8px;
    position: absolute;
    top: 6px;
    left: 3px;
    border-radius: 50%;
    background: var(--clr-accent);
  }
</style>