<script>
	export let text = "Hello World";
</script>

<div class="c-subcomponent" on:click={() => {text = `${text}.`}}>

    <div class="c-subcomponent__text">
        Svelte: {text}
    </div>

</div>