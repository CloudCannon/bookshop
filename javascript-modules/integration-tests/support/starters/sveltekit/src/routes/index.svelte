<script context="module">
	import { loadPage } from "$lib/routing.js";

	export async function load({ fetch }) {
		return await loadPage("/index.json", { fetch });
	}
</script>

<script>
	import { onDestroy, onMount } from "svelte";
	import {
		onCloudCannonChanges,
		stopCloudCannonChanges,
	} from "@cloudcannon/svelte-connector";

	export let pageDetails;

	onMount(async () => {
		onCloudCannonChanges((newProps) => (pageDetails = newProps));
	});

	onDestroy(async () => {
		stopCloudCannonChanges();
	});
</script>

<div>
	{#if pageDetails.content_html}
		<div>{@html pageDetails.content_html}</div>
	{/if}
</div>
