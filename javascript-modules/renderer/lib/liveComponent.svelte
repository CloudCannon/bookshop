<script>
    import {onMount} from 'svelte';
    import { Base64 } from 'js-base64';
    import getJekyllEngine from './jekyll/engine';

    export let components = {};
    export let selectedComponent = 'nothing';
    export let originalHTML = '';
    export let props = null;

    let selectedFramework = 'jekyll';
    let outputHTML = '';                    // Static rendered component

    // TODO: Decouple this from the jekyll engine again
    const getSourceFn = (componentName, type) => {
        if (/__template/.test(componentName)) {
            return `
                <p>Templated component ${componentName.replace(".__template", "")} 
                   cannot be shown in the live preview</p>
            `;
        }
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
        outputHTML = await jekyllEngine(getSourceFn(component, 'jekyll'), props, window.bookshopSiteData);
        setTimeout(() => {
            const svelteElements = document.querySelectorAll(`[data-bookshop-svelte-props]`);
            svelteElements.forEach((el) => {
                let componentProps = {};
                if (el.dataset?.bookshopSvelteProps) {
                    componentProps = JSON.parse(Base64.decode(el.dataset?.bookshopSvelteProps));
                }
                const svelteComponent = getSourceFn(el.dataset?.svelteSlab, "svelte");
                el.innerHTML = "";
                if (svelteComponent) {
                    new svelteComponent({
                        target: el,
                        props: componentProps
                    });
                }
            });
        }, 1);
    };
    $: if (hydratedComponents && props) render(selectedComponent, props);
</script>

{@html props ? outputHTML : originalHTML}
