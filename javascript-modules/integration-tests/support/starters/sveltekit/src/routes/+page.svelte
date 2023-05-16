<script>
    import { onDestroy, onMount } from "svelte";
    import {
        onCloudCannonChanges,
        stopCloudCannonChanges,
    } from "@cloudcannon/svelte-connector";
    import {
        Bookshop,
        trackBookshopLiveData,
    } from "@bookshop/sveltekit-bookshop";

    export let data;
    let pageDetails = data.data;

    onMount(async () => {
        onCloudCannonChanges(
            (newProps) => (pageDetails = trackBookshopLiveData(newProps))
        );
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
