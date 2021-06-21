<script>
    import {onMount} from 'svelte';
    import Editor from './code-editor/editor.svelte';
    import List from './bookshop/list.svelte';
    import getJekyllEngine from './jekyll/engine';
    import processBookshopProps from './bookshop/props-helper';

    const toml = require('@ltd/j-toml');
    const yaml = require('js-yaml');

    export let components = {};
    export let exclude = [];

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
        o['all_bookshop'] = {
            identity: {
                label: "All Components",
                icon: "menu_book"
            },
            frameworks: {
                'jekyll' : ''
            }
        }
        Object.entries(ogComponents).forEach(([key, component]) => {
            const config = component.config;
            delete component.config;
            const configData = toml.parse(config ?? "", 1, "\n", false);
            let excludedTag = false;
            configData?.component?.tags?.forEach(tag => {
                if (exclude.indexOf(tag) >= 0) {
                    excludedTag = true;
                }
            });
            if (excludedTag) return;
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
        if (component === 'all_bookshop') {
            const bookshop_components = [];
            for (const [bookshop_component_name, bookshop_component_data] of Object.entries(hydratedComponents)) {
                if (bookshop_component_name === 'all_bookshop') continue;
                const transformedConfig = processBookshopProps(bookshop_component_data?.parsedConfig);
                const bookshop_component = await render(bookshop_component_name, transformedConfig, selectedFramework);
                bookshop_components.push(`
                    <div style="display: block;">
                        <p style="font-family: monospace; font-size: 14px; font-weight: bold; padding: 8px 10px;">
                            <span style="font-size: 16px; vertical-align: sub;" class="material-icons">${bookshop_component_data?.identity?.icon}</span>
                            ${bookshop_component_data?.identity?.label || bookshop_component_name}
                        </p>
                        <div style="display: block; border-bottom: solid 1px #ccc; padding-bottom: 30px;">
                            ${bookshop_component}
                        </div>
                    </div>`);
            }
            return bookshop_components.join('');
        };
        yamlError = false;
        let props = data;
        if (typeof data === 'string') {
            try {
                props = yaml.load(data);
            } catch (e) {
                props = {};
                yamlError = true;
                console.log(e);
            }
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
        
        return outputText;
    };

    const renderToHTML = async (component, data, framework) => {
        outputHTML = await render(component, data, framework);
        setTimeout(() => {
            const svelteElements = document.querySelectorAll(`[data-bookshop-svelte-props]`);
            svelteElements.forEach((el) => {
                try {
                    const componentName = el.dataset.svelteSlab;
                    const componentProps = JSON.parse(atob(el.dataset.bookshopSvelteProps));
                    const svelteEl = hydratedComponents[componentName].frameworks.svelte;
                    el.innerHTML = "";
                    new svelteEl({
                        target: el,
                        props: componentProps
                    });
                } catch(e) {
                    console.error("Bookshop svelte error", e);
                }
            });
        }, 1);
    }

    $: if (hydratedComponents) renderToHTML(selectedComponent, yamlProps, selectedFramework);

    const updateComponent = async (component, framework) => {
        if (component === 'nothing') return;
        availableFrameworks = Object.keys(hydratedComponents?.[component]?.frameworks || {});
        if (!hydratedComponents?.[component]?.frameworks?.[framework]) {
            framework = selectedFramework = availableFrameworks[0] || 'none';
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

<div class="bookshop-renderer" class:thin={!editYaml}>
    <List components={hydratedComponents} 
          bind:selectedComponent={selectedComponent}
          bind:selectingComponent={selectingComponent} />

    <div class="component-info">
        <div class="nav-pane">
            <button 
                class="menu material-icons"
                on:click={() => selectingComponent = true}>folder_open</button>
            <button 
                class="menu material-icons" 
                on:click={() => editYaml = !editYaml}>{editYaml ? 'vertical_align_top' : 'vertical_align_bottom'}</button>
        </div>
        <div class="content-pane">

            <div class="component-title">
                <span class="material-icons">{hydratedComponents[selectedComponent]?.identity?.icon}</span>
                <span>{hydratedComponents[selectedComponent]?.identity?.label}</span>
            </div>

            {#if editYaml && hydratedComponents[selectedComponent]?.config}
            <div class="component-data">
                <p class="description">{hydratedComponents[selectedComponent]?.identity?.description}</p>

                <p class="title">Frameworks</p>
                <p class="label buttons">
                {#each availableFrameworks as framework}
                    <button 
                        class:selected={selectedFramework === framework}
                        on:click={() => {selectedFramework = framework}}>{framework}</button>
                {/each}
                </p>

                <p class="title">Array Structures</p>
                <p class="label">{hydratedComponents[selectedComponent]?.identity?.array_structures?.join(', ')}</p>

                <p class="title">Tags</p>
                <p class="label">{hydratedComponents[selectedComponent]?.identity?.tags?.join(', ')}</p>

            </div>
            {/if}
        </div>
    </div>

    {#if editYaml && hydratedComponents[selectedComponent]?.config}
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
<p class="card">👋&nbsp; Hello, I am the bookshop renderer. Select a component from the bookshop above.</p>
{/if}

<style>

.bookshop-renderer {
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

.component-info {
    width: 300px;
    min-width: 300px;
    box-sizing: border-box;
    padding: 0;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: stretch;
}

.nav-pane {
    background-color: #fafafa;
    border-right: solid 1px #eee;
    width: 44px;
    min-width: 44px;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.thin .nav-pane {
    flex-direction: row;
    width: auto;
}

.menu {
    appearance: none;
    -webkit-appearance: none;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 14px;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
}

.menu:hover {
    background-color: #eee;
}

.content-pane {
    box-sizing: border-box;
    padding: 14px;
    width: 100%;
}

.component-data .description {
    font-size: 12px;
    color: rgb(65, 65, 65);
    margin: 10px 0 16px 0;
    max-width: 160px;
}
.component-data p {
    margin: 0;
}
.component-data .title {
    font-size: 12px;
    font-weight: bold;
}
.component-data .label {
    font-size: 12px;
    font-weight: 600;
    font-family: monospace;
    color: rgb(176, 61, 0);
    margin-bottom: 10px;
}
.component-data .label.buttons {
    display: flex;
}
.component-data .label.buttons button {
    padding: 0 5px 0 0;
    appearance: none;
    -webkit-appearance: none;
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 12px;
    font-weight: 600;
    font-family: monospace;
    color: rgb(0, 135, 176);
}
.component-data .label.buttons button.selected {
    color: rgb(176, 61, 0);
}
.component-data .label.buttons button:hover {
    text-decoration: underline;
}

.material-icons {
    font-size: 14px;
    display: inline-block;
    width: 20px;
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
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 228px;
}
</style>