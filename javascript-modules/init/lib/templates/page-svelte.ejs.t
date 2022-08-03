<script>
  import { Bookshop } from "@bookshop/sveltekit-bookshop";

  export let content_blocks = [];
</script>

<div>
  <!-- We need to key these components such that Svelte
       understands how to reorder them when visual editing -->
  {#each content_blocks as component, i (`${component._bookshop_name}-${i}`)}
    <Bookshop {...component} />
  {/each}
</div>
