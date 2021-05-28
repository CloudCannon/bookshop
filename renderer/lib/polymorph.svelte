<script>
    import {onMount} from 'svelte';
    import Editor from './code-editor/editor.svelte';
    import List from './bookshop/list.svelte';
    import getJekyllEngine from './jekyll/engine';
    import processBookshopProps from './bookshop/props-helper';

    const toml = require('@ltd/j-toml');
    const yaml = require('js-yaml');

    export let components = {};

    let prevSelectedComponent = 'alsonothing';
    let selectedComponent = 'nothing';
    let selectingComponent = false;
    let selectedFramework = '';
    let availableFrameworks = [];           // Currently available for the selected component

    let untouchedYamlProps = '# Nothing';   // What is currently on disk
    let yamlProps = '# Nothing';            // Edited in the browser

    let outputHTML = '';                    // Static rendered component
    let outputComponent = null;             // Svelte rendered component
    let outputProps = {};                   // Props for the svelte component

    let editYaml = true;
    let yamlError = false;
    let updateMsg = false;                  // HMR signaller

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
            const config = component.config;
            delete component.config;
            const configData = toml.parse(config ?? "", 1, "\n", false);
            o[key] = {
                identity: configData.component ?? {
                    label: key,
                    icon: "add_block"
                },
                parsedConfig: configData,
                config: config,
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
    $: {
        if (Object.keys(hydratedComponents).length) {
            updateComponent(selectedComponent, selectedFramework);
        };
    }

    const render = async (component, data, framework) => {
        let props;
        try {
            props = yaml.load(data);
            yamlError = false;
        } catch (e) {
            props = {};
            yamlError = true;
            console.log(e);
        }
        let outputText;
        switch(framework) {
            case "jekyll":
                outputText = await jekyllEngine(getSourceFn(component, 'jekyll'), props);
                outputComponent = null;
                outputProps = null;
                break;
            case "svelte":
                outputComponent = getSourceFn(component, 'svelte');
                outputProps = props;
                outputText = null;
                break;
        }
        
        outputHTML = outputText;
    };
    $: render(selectedComponent, yamlProps, selectedFramework);

    const updateComponent = async (component, framework) => {
        if (component === 'nothing') return;
        availableFrameworks = Object.keys(hydratedComponents?.[component]?.frameworks || {});
        if (!hydratedComponents?.[component]?.frameworks?.[framework]) {
            framework = selectedFramework = availableFrameworks[0];
        }

        const currentURL = new URL(window.location);
        currentURL.hash = `${component}:${framework}`;
        window.history.replaceState({}, "", currentURL);

        const transformedConfig = processBookshopProps(hydratedComponents?.[component]?.parsedConfig);
        const componentYaml = yaml.dump(transformedConfig ?? "", {
            noRefs: true
        });

        const newComponentSelected = prevSelectedComponent !== component;
        const newComponentConfig = untouchedYamlProps !== componentYaml;
        if (newComponentSelected || newComponentConfig) {
            yamlProps = untouchedYamlProps = componentYaml;
        }

        prevSelectedComponent = component;
    }

    const updateCode = (event) => {
        yamlProps = event.detail.code;
    }

    onMount(() => {
        let curUrl = new URL(window.location);
        if (curUrl.hash) {
            let urlComponent = curUrl.hash.replace(/^#/, '');
            let [c, f] = urlComponent.split(":");
            selectedComponent = c;
            selectedFramework = f;
        }
    });
</script>

<div class="polymorph" class:thin={!editYaml}>
    <List components={hydratedComponents} 
          bind:selectedComponent={selectedComponent}
          bind:selectingComponent={selectingComponent} />

    <div class="component-info">
        <button 
            class="menu material-icons"
            on:click={() => selectingComponent = true}>folder_open</button>

        <p class="component-title">
            {hydratedComponents[selectedComponent]?.identity?.label}
        </p>

    {#if availableFrameworks.length > 1}
        <select bind:value={selectedFramework}>
        {#each availableFrameworks as framework}
            <option value="{framework}">{framework}</option>
        {/each}
        </select>
    {:else}
        <p class="tag">{selectedFramework}</p>
    {/if}
    {#if selectedComponent !== 'nothing'}
        <button on:click={() => editYaml = !editYaml}>{editYaml ? 'Hide' : 'Edit'} Props</button>
    {/if}
    <button on:click={() => selectingComponent = true}>Select component</button>
    </div>

    {#if editYaml}
        <Editor code={untouchedYamlProps} error={yamlError} on:newcode={updateCode} />
    {/if}
</div>


{#if yamlError}
<p class="card">😭&nbsp; Your YAML has an error.</p>
{:else if outputHTML}
{@html outputHTML}
{:else if (outputComponent)}
<svelte:component this={outputComponent} {...outputProps} />
{:else}
<p class="card">👋&nbsp; Hello, I am the polymorph. Select a component from the bookshop above.</p>
{/if}

<style>

.polymorph {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
 Helvetica, Arial, sans-serif,
 "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    display: flex;
    position: relative;
    background-color: #fff;
    box-sizing: border-box;
}

.component-info {
    width: 300px;
    min-width: 300px;
    box-sizing: border-box;
    padding: 14px 14px 14px 44px;
    position: relative;
}

.menu {
    appearance: none;
    -webkit-appearance: none;
    border: none;
    background: transparent;
    position: absolute;
    top: 12px;
    left: 12px;
    cursor: pointer;
    font-size: 14px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.menu:hover {
    background-color: #eee;
}

.thin .component-info {
    display: flex;
    flex-direction: row;
    width: 100%;
}

.component-title {
    font-size: 14px;
    font-weight: bold;
    margin: 0;
}

.tag {
    display: block;
    font-size: 12px;
    font-family: monospace;
    color: rgb(176, 61, 0);
}
</style>