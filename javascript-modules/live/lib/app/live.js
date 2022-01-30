import * as core from './core.js';

const sleep = (ms = 0) => {
    return new Promise(r => setTimeout(r, ms));
}

export const getLive = (engines) => class BookshopLive {
    constructor(options) {
        this.engines = engines;
        this.elements = [];
        this.globalData = {};
        this.data = {};
        this.renderOptions = {};
        this.hasRendered = false;
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

    async renderElement(componentName, scope, dom) {
        try {
            await this.engines[0].render(dom, componentName, scope, { ...this.globalData });
        } catch (e) {
            console.warn(`Error rendering bookshop component ${componentName}`, e);
            console.warn(`This is expected in certain cases, and may not be an issue, especially when deleting or re-ordering components.`)
        }
    }

    async eval(identifier, scope) {
        return await this.engines[0].eval(identifier, scope);
    }

    normalize(identifier) {
        if (typeof this.engines[0].normalize === 'function') {
            return this.engines[0].normalize(identifier);
        }
        return identifier;
    }

    async update(data, options) {
        // transformData = false means implementations like Jekyll 
        // won't wrap the data in { page: {} }
        // (this is currently only used for tests)
        if (typeof this.engines[0].transformData === 'function'
            && options?.transformData !== false) {
            this.data = this.engines[0].transformData(data);
        } else {
            this.data = data;
        }
        this.renderOptions = options;
        while (this.awaitingDataFetches > 0) {
            await sleep(100);
        }
        await this.render();
        this.hasRendered = true;
    }

    async render() {
        const CCEditorPanelSupport = typeof window === 'undefined' || typeof window !== 'undefined' && window.CloudCannon?.refreshInterface;
        const options = {
            dataBindings: CCEditorPanelSupport,
            ...this.renderOptions
        };

        if (typeof window !== 'undefined' && (window.bookshopEditorLinks === false || window.bookshopDataBindings === false)) {
            options.dataBindings = false;
        }

        // Legacy flag
        if (options.editorLinks === false) {
            options.dataBindings = false;
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
            stashedNodes, // Any bookshop_bindings tags that were applied to this component
        } of componentUpdates) {
            if (options.dataBindings) { // If we should be adding data bindings _in general_
                // Re-traverse this component to inject any data bindings we can to it or its children.
                await core.hydrateDataBindings(this, output, pathStack, startNode.cloneNode(), endNode.cloneNode(), stashedNodes.map(n => n.cloneNode()));
            }

            core.graftTrees(startNode, endNode, output);
        }
    }
}
