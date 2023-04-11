<script>
    import { onMount } from "svelte";
    import { beforeUpdate, afterUpdate } from "svelte";
    import { make_bookshop_proxy } from "./proxy.js";

    export let component = "";
    export let shared = "";

    let proxied_fields = $$restProps;
    let components;
    if (typeof BOOKSHOP_COMPONENT_BROWSER === "undefined") {
        components = import.meta.glob("$bookshop/**/*.svelte", {
            eager: true,
        });
    } else {
        components = window.__bookshop_svelte_files ?? {};
    }

    const getComponentKey = (name) => {
        const base = name.split("/").reverse()[0];
        return `components/${name}/${base}.svelte`;
    };
    const getFlatComponentKey = (name) => {
        return `components/${name}.svelte`;
    };

    let TargetComponent;
    let dataBindPath;
    let commentID;
    let paths = [];
    if (component) {
        paths = [getComponentKey(component), getFlatComponentKey(component)];
    } else if (shared) {
        paths = [`shared/svelte/${shared}.svelte`];
    } else if ($$restProps._bookshop_name) {
        paths = [
            getComponentKey($$restProps._bookshop_name),
            getFlatComponentKey($$restProps._bookshop_name),
        ];
    } else {
        throw new Error("No component or shared key passed to Bookshop.");
    }

    // Grab a matching component with the longest path to prioritize standard components over flat names
    TargetComponent = Object.entries(components)
        .filter(([k]) => paths.some((path) => k.endsWith(path)))
        ?.sort?.((a, b) => b[0].length - a[0].length)?.[0]?.[1];

    // In the component browser context we won't get it as `.default`,
    // but through Vite we do.
    if (typeof BOOKSHOP_COMPONENT_BROWSER === "undefined") {
        TargetComponent = TargetComponent.default;
    }

    if (!TargetComponent) {
        throw new Error(
            [
                `Component not found for ${shared || component}`,
                `Add this component at one of these paths in a component folder: [ ${paths.join(
                    ", "
                )} ]`,
            ].join("\n")
        );
    }

    const updateDataBindings = () => {
        proxied_fields = {};
        let dataBindPaths = [];
        let skipDataBind = false;
        for (let [k, value] of Object.entries($$restProps)) {
            if (
                [
                    "dataBinding",
                    "_dataBinding",
                    "data_binding",
                    "_data_binding",
                    "editorLink",
                    "_editorLink",
                    "editor_link",
                    "_editor_link",
                ].includes(k)
            ) {
                skipDataBind = true;
            }
            if (value?.__bookshop_path) {
                dataBindPaths.push(
                    value.__bookshop_path.replace(/\.?\w+$/, "")
                );
            }
            if (k === "_bookshop_name") {
                proxied_fields[k] = value;
            } else {
                proxied_fields[k] = make_bookshop_proxy(value);
            }
        }
        if (!skipDataBind) {
            dataBindPath =
                dataBindPaths.sort((a, b) => {
                    return a.split(".").length - b.split(".").length;
                })?.[0] ?? "";
        }
    };

    beforeUpdate(() => {
        if (window.inEditorMode) {
            liveRendering = true;
        }
        updateDataBindings();
    });

    const getTemplateCommentIterator = () => {
        const documentNode = document;
        return documentNode.evaluate(
            `//comment()[contains(.,'${commentID}')]`,
            documentNode,
            null,
            XPathResult.ANY_TYPE,
            null
        );
    };

    let firstRender = true;
    afterUpdate(() => {
        if (liveRendering && dataBindPath) {
            const iterator = getTemplateCommentIterator();
            const startNode = iterator.iterateNext();
            const endNode = iterator.iterateNext();
            if (!startNode || !endNode) return;

            let node = startNode.nextElementSibling;
            while (
                node &&
                (node.compareDocumentPosition(endNode) &
                    Node.DOCUMENT_POSITION_FOLLOWING) !==
                    0
            ) {
                node.dataset.cmsBind = `#${dataBindPath}`;
                node = node.nextElementSibling;
            }
            if (firstRender) {
                window?.CloudCannon?.refreshInterface?.();
                firstRender = false;
            }
        }
    });

    let liveRendering = false;
    onMount(() => {
        if (window.inEditorMode) {
            liveRendering = true;
            commentID = crypto.randomUUID ? crypto.randomUUID() : Math.random();
            updateDataBindings();
        }
    });
</script>

{#if liveRendering}
    {#key commentID}
        {#if liveRendering}{@html `<!--${commentID}-->`}{/if}
        <svelte:component this={TargetComponent} {...proxied_fields} />
        {#if liveRendering}{@html `<!--${commentID}-->`}{/if}
    {/key}
{:else}
    <svelte:component this={TargetComponent} {...proxied_fields} />
{/if}
