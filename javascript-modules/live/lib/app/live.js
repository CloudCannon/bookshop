import * as core from './core.js';

export const getLive = (engines) => class BookshopLive {
    constructor(options) {
        this.engines = engines;
        this.elements = [];
        this.globalData = {};
        this.data = {};
        this.renderOptions = {};
        this.pendingRender = false;
        this.awaitingDataFetches = options?.remoteGlobals?.length || 0;
        options?.remoteGlobals?.forEach(this.fetchGlobalData.bind(this));
    }

    async fetchGlobalData(path) {
        try {
            const dataReq = await fetch(path);
            const data = await dataReq.json();
            Object.assign(this.globalData, data);
            this.awaitingDataFetches -= 1;
        } catch (e) {
            this.awaitingDataFetches -= 1;
        }
        if (this.awaitingDataFetches <= 0 && this.pendingRender) {
            await this.render()
        }
    }

    readElement(el) {
        return {
            dom: el,
            originalHTML: el.innerHTML,
            componentName: el.dataset.bookshopLive,
            componentPropSource: el.dataset.bookshopProps,
        }
    }

    resolveComponentType(componentName) {
        return this.engines[0].resolveComponentType(componentName);
    }

    async renderElement(componentName, scope, bindings, dom) {
        try {
            await this.engines[0].render(dom, componentName, scope, { ...this.globalData, ...bindings });
        } catch (e) {
            console.warn(`Error rendering bookshop component ${componentName}`, e);
            console.warn(`This is expected in certain cases, and may not be an issue, especially when deleting or re-ordering components.`)
        }
    }

    async eval(identifier, scope) {
        return await this.engines[0].eval(identifier, scope);
    }

    async update(data, options) {
        this.data = data;
        this.renderOptions = options;
        if (this.awaitingDataFetches > 0) {
            this.pendingRender = true;
        } else {
            await this.render();
        }
    }

    async render() {
        const CCEditorPanelSupport = typeof window === 'undefined' || typeof window !== 'undefined' && window.CloudCannon?.refreshInterface;
        const options = {
            editorLinks: CCEditorPanelSupport,
            ...this.renderOptions
        };

        if (typeof window !== 'undefined' && window.bookshopEditorLinks === false) {
            options.editorLinks = false;
        }

        // Render _all_ components found on the page into virtual DOM nodes
        // Returned in depth-first ordering. Children will be listed before their parents,
        // which allows parents to _not_ re-render if only a child changed.
        const componentUpdates = await core.renderComponentUpdates(this, document);

        for (let {
            startNode,  // The bookshop-live comment before this component's location in real-DOM
            endNode,    // The bookshop-live end comment following this component's location in real-DOM
            output,     // A virtual-DOM node containing contents of the just-rendered component
            pathStack,  // Any "absolute paths" to data in scope for this component
        } of componentUpdates) {
            if (options.editorLinks) { // If we should be adding editor links _in general_
                // Re-traverse this component to inject any editor links we can to it or its children.
                await core.hydrateEditorLinks(this, output, pathStack, startNode.cloneNode(), endNode.cloneNode());
            }

            // We can short-circuit doing any slow real-DOM work here
            // if we can tell that this render didn't change anything.
            if (core.buildDigest(startNode, endNode) === output.innerHTML) {
                continue;
            }

            core.replaceHTMLRegion(startNode, endNode, output);
        }
    }
}
