<script>
    import {onMount} from 'svelte';
    import getJekyllEngine from './jekyll/engine';

    export let components = {};
    export let selectedComponent = 'nothing';
    export let originalHTML = '';
    export let props = null;

    let selectedFramework = 'jekyll';
    let outputHTML = '';                    // Static rendered component

    // TODO: Decouple this from the jekyll engine again
    const getSourceFn = (componentName, type) => {
        componentName = componentName.replace(/\/$/, '');
        return hydratedComponents[componentName]?.frameworks?.[type] ?? '';
    }
    const jekyllEngine = getJekyllEngine(getSourceFn);

    // Pre-parse all of our TOML files
    const hydrate = (ogComponents) => {
        const o = {};
        Object.entries(ogComponents).forEach(([key, component]) => {
            o[key] = {
                frameworks: {
                    ...component
                }
            }
        });
        return o;
    }
    let hydratedComponents = {};
    $: {
        hydratedComponents = hydrate(components);
        console.log(`Components Updated.`);
    }

    const render = async (component, props) => {
        outputHTML = await jekyllEngine(getSourceFn(component, 'jekyll'), props);
        setTimeout(() => {
            const svelteElements = document.querySelectorAll(`[data-bookshop-svelte-props]`);
            svelteElements.forEach((el) => {
                el.innerHTML = `<p>Dynamic component ${el.dataset?.svelteSlab} cannot be rendered in the live editor yet.</p>`;
            });
        }, 1);
    };
    $: if (hydratedComponents && props) render(selectedComponent, props);
</script>

{@html props ? outputHTML : originalHTML}
