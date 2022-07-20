<script>
    import { Bookshop } from ".";
    import { onMount } from "svelte";
    import { beforeUpdate, afterUpdate } from "svelte";
    import { make_bookshop_proxy } from "./proxy.js";

    export let component;
    export let shared;

    let components = import.meta.glob("$components/**/*.svelte", {
        eager: true,
    });

    let TargetComponent;
    let path;
    if (component) {
        path = `components/${component}/${component}.svelte`;
    } else if (shared) {
        path = `shared/svelte/${shared}.svelte`;
    } else {
        throw new Error("No component or shared key passed to Bookshop.");
    }
    TargetComponent = Object.entries(components).filter(([k]) =>
        k.endsWith(path)
    )?.[0]?.[1]?.default;

    if (!TargetComponent) {
        throw new Error(`Component not found for ${shared || component}`);
    }

    let proxied_fields = make_bookshop_proxy($$restProps);

    beforeUpdate((e) => {
        console.log(e);
    });

    afterUpdate((e) => {
        console.log(e, "I HAVE UPDATED");
    });

    let liveRendering = false;
    onMount(() => {
        liveRendering = true;
    });
</script>

{#if liveRendering}{@html "<!--StartHello-->"}{/if}
<svelte:component this={TargetComponent} {Bookshop} {...proxied_fields} />
{#if liveRendering}{@html "<!--EndHello-->"}{/if}
