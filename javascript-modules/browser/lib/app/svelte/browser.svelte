<script>
    import {onMount} from 'svelte';
    import {hydrateComponents, updateUrl, loadYaml} from './lib/helpers.js';
    import Library from './lib/library.svelte';
    import InfoPane from './lib/info-pane.svelte';
    import Editor from './lib/code-editor/editor.svelte';
    
    export let engines = [];
    export let components = {};
    export let globalData = {};
    export let exclude = [];
    
    let editProps = true;
    
    let baseYaml = '# Nothing';     // What is currently on disk
    let editedYaml = '# Nothing';   // Edited in the browser
    let yamlError = false;
    
    let selectingComponent = false;
    let selectedComponent = "nothing";
    let previousComponent = "nothing";
    let framework = "none";

    let outputHTML = "";
    
    let hydratedComponents = null;
    $: {
        hydratedComponents = hydrateComponents(components, engines, exclude);
        console.log(`Components Updated.`);
    }
    
    const refreshComponent = async (component, framework) => {
        componentDetail = hydratedComponents?.[component];
        if (!componentDetail) return;
        
        availableFrameworks = componentDetail.frameworks || [];
        if (!availableFrameworks.includes(framework)) {
            framework = selectedFramework = availableFrameworks[0] || 'none';
        }
        
        updateUrl(component, framework);
        
        const newComponentSelected = previousComponent !== component;
        const newComponentConfig = baseYaml !== componentDetail.yaml;
        if (newComponentSelected || newComponentConfig) {
            editedYaml = baseYaml = componentDetail.yaml;
        }
        
        previousComponent = component;
    }
    $: if (hydratedComponents) refreshComponent(selectedComponent, framework);
    
    const render = async (component, yamlProps, framework) => {
        if (framework === 'none') return;
        const engine = engines.filter(e => e.key === framework)[0];
        if (!engine) {
            console.warn(`Engine ${framework} not found.`);
            outputHTML = "";
            return;
        }

        let {props, err} = loadYaml(yamlProps);
        yamlError = err;
        if (yamlError) return;

        outputHTML = await engine.render(component, props, globalData);
        if (!outputHTML) console.warn(`Engine ${framework} returned nothing for ${component}.`);
    }
    $: if (hydratedComponents) render(selectedComponent, editedYaml, framework);

    const updateCode = (event) => {
        editedYaml = event.detail.code;
    }

    onMount(() => {
        let curUrl = new URL(window.location);
        if (curUrl.hash) {
            let urlComponent = curUrl.hash.replace(/^#/, '');
            let [c, f] = urlComponent.split(":");
            selectedComponent = c;
            framework = f;
        }
    });
</script>
<div class="bookshop-browser">
    <Library components={hydratedComponents}
        bind:selectedComponent={selectedComponent}
        bind:selectingComponent={selectingComponent}
        bind:framework={framework} />
    
    <InfoPane component={hydratedComponents[selectedComponent]}
        bind:selectingComponent={selectingComponent}
        bind:framework={framework}
        bind:editProps={editProps} />
    
    {#if editProps && hydratedComponents[selectedComponent]?.props}
    <Editor code={baseYaml} error={yamlError} on:newcode={updateCode} />
    {/if}
</div>

{#if outputHTML}
{@html outputHTML}
{/if}

<style>
    .bookshop-browser {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
        Helvetica, Arial, sans-serif,
        "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
        font-size: 12px;
        display: flex;
        position: relative;
        background-color: #fff;
        box-sizing: border-box;
        border-bottom: solid 1px #eee;
    }

    :global(.bookshop-icon-string) {
        display: flex;
        align-items: center;
    }

    :global(.bookshop-browser :where(.cm-gutters, .cm-content)) {
        min-height: 300px !important;
    }
</style>

    