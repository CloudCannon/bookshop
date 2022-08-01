<script>
    import { onMount } from "svelte";
    import { beforeUpdate, afterUpdate } from "svelte";
    import { make_bookshop_proxy } from "./proxy.js";

    export let component;
    export let shared;

    let proxied_fields = $$restProps;
    let components;
    if (typeof BOOKSHOP_COMPONENT_BROWSER === "undefined") {
        components = import.meta.glob("$components/**/*.svelte", {
            eager: true,
        });
    } else {
        components = window.__bookshop_svelte_files ?? {};
    }

    const getComponentKey = (name) => {
        const base = name.split("/").reverse()[0];
        return `components/${name}/${base}.svelte`;
    };

    let TargetComponent;
    let dataBindPath;
    let commentID;
    let path;
    if (component) {
        path = getComponentKey(component);
    } else if (shared) {
        path = `shared/svelte/${shared}.svelte`;
    } else if ($$restProps._bookshop_name) {
        path = `components/${$$restProps._bookshop_name}/${$$restProps._bookshop_name}.svelte`;
    } else {
        throw new Error("No component or shared key passed to Bookshop.");
    }
    TargetComponent = Object.entries(components).filter(([k]) =>
        k.endsWith(path)
    )?.[0]?.[1];

    // In the component browser context we won't get it as `.default`,
    // but through Vite we do.
    if (typeof BOOKSHOP_COMPONENT_BROWSER === "undefined") {
        TargetComponent = TargetComponent.default;
    }

    if (!TargetComponent) {
        throw new Error(`Component not found for ${shared || component}`);
    }

    beforeUpdate(() => {
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
            if (value.__bookshop_path) {
                dataBindPaths.push(
                    value.__bookshop_path.replace(/\.?\w+$/, "")
                );
            }
            proxied_fields[k] = make_bookshop_proxy(value);
        }
        if (!skipDataBind) {
            dataBindPath =
                dataBindPaths.sort((a, b) => {
                    return a.split(".").length - b.split(".").length;
                })?.[0] ?? "";
        }
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
        }
    });

    let liveRendering = false;
    onMount(() => {
        liveRendering = true;
        commentID = crypto.randomUUID ? crypto.randomUUID() : Math.random();
    });
</script>

{#if liveRendering}{@html `<!--${commentID}-->`}{/if}
<svelte:component this={TargetComponent} {...proxied_fields} />
{#if liveRendering}{@html `<!--${commentID}-->`}{/if}
