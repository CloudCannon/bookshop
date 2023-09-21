<script>
    import { onMount } from "svelte";
    import { hydrateComponents, updateUrl, loadYaml } from "./lib/helpers.js";
    import { iconSvg } from "./lib/icons.js";
    import Library from "./lib/library.svelte";
    import InfoPane from "./lib/info-pane.svelte";
    import Editor from "./lib/code-editor/editor.svelte";

    export let engines = [];
    export let components = {};
    export let globalData = {};
    export let exclude = [];

    let renderTarget,
        renderMap = {};

    let editProps = true;

    let baseYaml = "# Nothing"; // What is currently on disk
    let editedYaml = "# Nothing"; // Edited in the browser
    let yamlError = false;

    let selectingComponent = false;
    let selectedComponent = "nothing";
    let previousComponent = "nothing";
    let framework = "none";
    let previousFramework = "none";
    let activeEngine = {};

    let hydratedComponents = null;
    $: {
        activeEngine?.destroy?.(renderTarget);
        hydratedComponents = hydrateComponents(components, engines, exclude);
    }

    const refreshComponent = async (component, framework) => {
        let componentDetail = hydratedComponents?.[component];
        if (!componentDetail) return;

        let availableFrameworks = componentDetail.frameworks || [];
        if (!availableFrameworks.includes(framework)) {
            framework = selectedFramework = availableFrameworks[0] || "none";
        }

        updateUrl(component, framework);

        const newComponentSelected = previousComponent !== component;
        const newFrameworkSelected = previousFramework !== framework;
        const newComponentConfig = baseYaml !== componentDetail.yaml;
        if (newComponentSelected || newComponentConfig) {
            editedYaml = baseYaml = componentDetail.yaml;
        }

        if (newComponentSelected || newFrameworkSelected) {
            destroyPreviousComponent();
            renderTarget.innerHTML = ""; // Clean up in case destroy() didn't
            renderMap = {};
        }

        previousComponent = component;
        previousFramework = framework;
    };
    $: if (hydratedComponents) refreshComponent(selectedComponent, framework);

    const destroyPreviousComponent = () => {
        const previousEngine = engines.filter(
            (e) => e.key === previousFramework
        )[0];
        if (previousEngine) {
            previousEngine.destroy?.(renderTarget, previousComponent);
        }
    };

    const buildComponentLadder = () => {
        Object.entries(hydratedComponents)
            .filter(([key]) => key !== "all_bookshop")
            .forEach(([key, component]) => {
                const sectionLabel = `<div data-bookshop-browser-section>${iconSvg(
                    component.identity.icon
                )} ${component.identity.label}</div>`;
                renderTarget.insertAdjacentHTML("beforeend", sectionLabel);

                const el = document.createElement("div");
                renderMap[key] = el;
                renderTarget.appendChild(el);
            });
    };

    const renderAllComponents = async (engine) => {
        if (!renderTarget.innerHTML) buildComponentLadder();
        const componentPromises = Object.entries(hydratedComponents)
            .filter(([key]) => key !== "all_bookshop")
            .map(([key, component]) => {
                return engine.render(
                    renderMap[key],
                    key,
                    component.props,
                    globalData
                );
            });
        await Promise.all(componentPromises);
    };

    const render = async (component, yamlProps, framework) => {
        if (framework === "none") return;
        const engine = engines.filter((e) => e.key === framework)[0];
        if (!engine) {
            console.warn(`Engine ${framework} not found.`);
            return;
        }

        if (component === "all_bookshop") {
            return await renderAllComponents(engine);
        }

        let { props, err } = loadYaml(yamlProps);
        yamlError = err;
        if (yamlError) return;

        activeEngine = engine;
        await engine.render(renderTarget, component, props, globalData);
        window.bookshopComponentHasRendered = true;
    };
    $: if (hydratedComponents) render(selectedComponent, editedYaml, framework);

    const updateCode = (event) => {
        editedYaml = event.detail.code;
    };

    onMount(() => {
        let curUrl = new URL(window.location);
        if (curUrl.hash) {
            let urlComponent = curUrl.hash.replace(/^#/, "");
            let [c, f] = urlComponent.split(":");
            selectedComponent = c;
            framework = f;
        }
    });
</script>

<div class="bookshop-browser-menus">
    <Library
        components={hydratedComponents}
        bind:selectedComponent
        bind:selectingComponent
        bind:framework
    />

    <InfoPane
        component={hydratedComponents[selectedComponent]}
        bind:selectingComponent
        bind:framework
        bind:editProps
    />

    {#if editProps && hydratedComponents[selectedComponent]?.props}
        <Editor code={baseYaml} error={yamlError} on:newcode={updateCode} />
    {/if}
</div>

<div class="bookshop-browser" bind:this={renderTarget} />

<style>
    .bookshop-browser-menus {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
            Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
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

    :global(.bookshop-browser-menus :where(.cm-gutters, .cm-content)) {
        min-height: 300px !important;
    }

    :global([data-bookshop-browser-section]) {
        display: flex;
        align-items: center;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica,
            Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji",
            "Segoe UI Symbol";
        font-size: 12px;
        width: 100%;
        padding: 12px 0 4px;
        border-top: solid 1px transparent;
        border-bottom: solid 1px transparent;
    }

    :global([data-bookshop-browser-section]:hover) {
        background-color: #eee;
        border-top: solid 1px #aaa;
        border-bottom: solid 1px #aaa;
    }
</style>
