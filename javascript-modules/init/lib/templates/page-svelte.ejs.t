<script>
  import { Bookshop } from "@bookshop/sveltekit-bookshop";

  export let content_blocks = [];
</script>

<div>
  {#each content_blocks as component}
    <Bookshop {...component} />
  {/each}
</div>
