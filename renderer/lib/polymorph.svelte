<script>
    import {onMount} from 'svelte';
    import getJekyllEngine from './jekyll/engine'
    const toml = require('@ltd/j-toml');
    const yaml = require('js-yaml');

    export let components = {};

    const getSourceFn = (componentName, type) => {
        componentName = componentName.replace(/\/$/, '');
        return components[componentName]?.[type] ?? '';
    }

    const jekyllEngine = getJekyllEngine(getSourceFn);

    let prevSelectedComponent = 'alsonothing';
    let selectedComponent = 'nothing';
    let selectedFramework = '';
    let outputHTML = '';
    let outputComponent = null;
    let outputProps = {};
    let untouchedYamlProps = '# Nothing';
    let yamlProps = '# Nothing';
    let editYaml = false;
    let updateMsg = false;

    $: componentList = Object.keys(components);
    $: if (components) updateComponent(selectedComponent, selectedFramework)
    $: render(selectedComponent, yamlProps, componentList, selectedFramework);
    $: currentFrameworks = components[componentList[selectedComponent]] ? frameworkKeys(components[componentList[selectedComponent]]) : [];
    $: {
        if (components) {
            updateMsg = true
            setTimeout(() => {updateMsg = false}, 1000);
        }
    }

    const render = async (c, p, l, framework) => {
        c = componentList[c] || 'nothing';
        if (c === 'nothing') return outputHTML = '';
        const props = yaml.load(p) ?? {};
        let outputText;
        switch(framework) {
            case "jekyll":
                outputText = await jekyllEngine(getSourceFn(c, 'jekyll'), props);
                outputComponent = null;
                outputProps = null;
                break;
            case "svelte":
                outputComponent = getSourceFn(c, 'svelte');
                outputProps = props;
                outputText = null;
                break;
        }
        
        outputHTML = outputText;
    };

    const updateComponent = async (c, f) => {
        c = componentList[c] || 'nothing';
        if (c === 'nothing') return;

        if (!components?.[c]?.[f]) {
            f = selectedFramework = frameworkKeys(components?.[c])?.[0];
        }

        const curUrl = new URL(window.location);
        curUrl.hash = `${c}:${f}`;
        window.history.replaceState({}, "", curUrl);
        
        const configData = toml.parse(components[c]?.config ?? "", 1, "\n", false);
        const editableProps = processProps(configData);
        const updatedYamlProps = yaml.dump(editableProps ?? "", {
            noRefs: true
        });

        if (prevSelectedComponent !== c || untouchedYamlProps !== updatedYamlProps) {
            yamlProps = updatedYamlProps;
            untouchedYamlProps = updatedYamlProps;
        }

        prevSelectedComponent = c;
    }

    const processProps = (obj) => {
        if (!obj) return {};
        if (obj.defaults && typeof obj.defaults === 'object') return processOldProps(obj.defaults);
        obj = obj.props ?? {};
        return processPropObject(obj);
    }

    const processPropObject = (obj) => {
        for (const key of Object.keys(obj)) {
            if (obj[key]?.select && Array.isArray(obj[key].select)) {
                obj[key] = obj[key].select[0]
            }

            if (obj[key]?.preview && Array.isArray(obj[key].preview)) {
                obj[key] = obj[key].preview[0]
            }

            if (obj[key]?.default) {
                obj[key] = obj[key].default
            }

            if (Array.isArray(obj[key])) {
                obj[key].forEach((arr_obj, index) => {
                    obj[key][index] = processPropObject(arr_obj);
                })
            } else if (typeof obj[key] === "object") {
                obj[key] = processPropObject(obj[key]);
            }
        }
        return obj;
    }

    // TODO: remove processOldProps — legacy bokshop support.
    const processOldProps = (obj) => {
        for (const key of Object.keys(obj)) {
            if (/--/.test(key)) {
                const newkey = key.split('--')[0];
                const keyType = key.split('--')[1];
                let newval;

                switch (keyType) {
                    case "check":
                    case "inline-check":
                    case "radio":
                    case "inline-radio":
                    case "preview":
                    case "select":
                    case "multi-select":
                        newval = obj[key][Object.keys(obj[key])[0]];
                        obj[newkey] = newval;
                        delete obj[key];
                        break;
                    case "repeat":
                        newval = [{...obj[key]}, {...obj[key]}, {...obj[key]}];
                        obj[newkey] = newval;
                        delete obj[key];
                        break;
                }
            }
        }
        return obj;
    }

    const frameworkKeys = (component) => {
        return Object.keys(component).filter(framework => framework !== 'config');
    }

    onMount(() => {
        let curUrl = new URL(window.location);
        if (curUrl.hash) {
            let urlComponent = curUrl.hash.replace(/^#/, '');
            let [c, f] = urlComponent.split(":");
            selectedComponent = componentList.indexOf(c);
            selectedFramework = f;
        }
    });
</script>

<div class="top-bar">
    <p class="status" class:show={!!updateMsg}>Reloaded!</p>

    <select bind:value={selectedComponent}>
    <option value="nothing"></option>
    {#each componentList as component, i}
        <option value="{i}">{component}</option>
    {/each}
    </select>

    {#if currentFrameworks.length > 1}
        <select bind:value={selectedFramework}>
        {#each currentFrameworks as framework}
            <option value="{framework}">{framework}</option>
        {/each}
        </select>
    {:else}
        <p class="label">{selectedFramework}</p>
    {/if}

    {#if selectedComponent !== 'nothing'}
    <button on:click={() => editYaml = !editYaml}>{editYaml ? 'Hide' : 'Edit'} Props</button>
    {/if}
</div>

{#if editYaml}
    <textarea bind:value={yamlProps}></textarea>
{/if}

{#if outputHTML}
{@html outputHTML}
{:else if (outputComponent)}
<svelte:component this={outputComponent} {...outputProps} />
{:else}
<p class="card">👋&nbsp; Hello, I am the polymorph. Select a component from the bookshop above.</p>
{/if}

<style>
.top-bar {
    display: flex;
    justify-content: flex-end;
    height: 50px;
    --background-body: #fff;
    --background: #ffffff;
    --background-alt: #f7f7f7;
    --selection: #9e9e9e;
    --text-main: #363636;
    --text-bright: #000;
    --text-muted: #70777f;
    --links: #0076d1;
    --focus: #0096bfab;
    --border: #dbdbdb;
    --code: #000;
    --animation-duration: 0.1s;
    --button-hover: #ddd;
    --scrollbar-thumb: rgb(213, 213, 213);
    --scrollbar-thumb-hover: rgb(196, 196, 196);
    --form-placeholder: #949494;
    --form-text: #000;
    --variable: #39a33c;
    --highlight: #ff0;
    --select-arrow: url("data:image/svg+xml;charset=utf-8,%3C?xml version='1.0' encoding='utf-8'?%3E %3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' height='62.5' width='116.9' fill='%23161f27'%3E %3Cpath d='M115.3,1.6 C113.7,0 111.1,0 109.5,1.6 L58.5,52.7 L7.4,1.6 C5.8,0 3.2,0 1.6,1.6 C0,3.2 0,5.8 1.6,7.4 L55.5,61.3 C56.3,62.1 57.3,62.5 58.4,62.5 C59.4,62.5 60.5,62.1 61.3,61.3 L115.2,7.4 C116.9,5.8 116.9,3.2 115.3,1.6Z'/%3E %3C/svg%3E");
}

.card {
    padding: 10px 20px;
    border: solid 1px grey;
    border-radius: 10px;
}

.status {
    opacity: 0;
    transition: opacity 0.5s ease;
    padding: 0 20px;
    color: rgb(86 86 86);
    font-weight: bold;
    margin: 0 0 6px 0;
    display: flex;
    align-items: center;
    position: relative;
}

.status.show {
    opacity: 1;
    transition: opacity 0s ease;
}

.status::before {
    content: "";
    width: 6px;
    height: 6px;
    border: solid 2px currentColor;
    border-left-color: transparent;
    border-right-color: transparent;
    border-radius: 50%;
    left: 0;
    top: calc(50% - 3px);
    position: absolute;
    opacity: 0;
}

.status.show::before {
    animation: spinny 1s linear infinite forwards;
    opacity: 1;
}

@keyframes spinny {
    0% {
        transform: rotateZ(0deg);
    }
    100% {
        transform: rotateZ(360deg);
    }
}

.label {
    height: 35px;
    box-sizing: border-box;
    word-wrap: break-word;
    transition: background-color var(--animation-duration) linear,
    border-color var(--animation-duration) linear,
    color var(--animation-duration) linear,
    box-shadow var(--animation-duration) linear,
    transform var(--animation-duration) ease;
    cursor: pointer;
    color: var(--form-text);
    background-color: var(--background);
    font-family: inherit;
    font-size: inherit;
    margin: 0 6px 6px 0;
    padding: 0 10px;
    border: none;
    border-radius: 6px;
    outline: none;
    -webkit-appearance: none;
    padding-right: 30px;
    padding-left: 30px;
    display: flex;
    align-items: center;
}

button {
    height: 35px;
    word-wrap: break-word;
    transition: background-color var(--animation-duration) linear,
    border-color var(--animation-duration) linear,
    color var(--animation-duration) linear,
    box-shadow var(--animation-duration) linear,
    transform var(--animation-duration) ease;
    cursor: pointer;
    color: var(--form-text);
    background-color: var(--background);
    font-family: inherit;
    font-size: inherit;
    margin-right: 6px;
    margin-bottom: 6px;
    padding: 0 10px;
    border: none;
    border-radius: 6px;
    outline: none;
    -webkit-appearance: none;
    padding-right: 30px;
    padding-left: 30px;
}

select {
    height: 35px;
    word-wrap: break-word;
    cursor: pointer;
    display: block;
    color: var(--form-text);
    background-color: var(--background);
    font-family: inherit;
    font-size: inherit;
    margin-right: 6px;
    margin-bottom: 6px;
    padding: 0 10px;
    border: none;
    border-radius: 6px;
    outline: none;
    -webkit-appearance: none;
    background: var(--background) var(--select-arrow) calc(100% - 12px) 50% / 12px no-repeat;
    padding-right: 35px;
}

textarea {
    --form-text: #000;
    --background: #efefef;
    --animation-duration: 0.1s;
    transition: background-color var(--animation-duration) linear,
    border-color var(--animation-duration) linear,
    color var(--animation-duration) linear,
    box-shadow var(--animation-duration) linear,
    transform var(--animation-duration) ease;
    color: var(--form-text);
    background-color: var(--background);
    font-family: inherit;
    font-size: inherit;
    margin-bottom: 6px;
    padding: 10px;
    border: none;
    border-radius: 6px;
    outline: none;
    -webkit-appearance: none;
    display: block;
    margin-right: 0;
    box-sizing: border-box;
    resize: vertical;
    width: 100%;
    min-height: 40px;
    height: 140px;
}

.label, button, select, textarea {
    border: solid 1px #ccc;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI",
 Helvetica, Arial, sans-serif,
 "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}

textarea {
    font-family: monospace;
}
</style>