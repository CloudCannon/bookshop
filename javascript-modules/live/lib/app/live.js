import * as core from './core.js';

export const getLive = (engines) => class BookshopLive {
    constructor(options) {
        this.engines = engines;
        this.elements = [];
        this.globalData = {};
        options?.remoteGlobals?.forEach(this.fetchGlobalData.bind(this));
    }

    async fetchGlobalData(path) {
        const dataReq = await fetch(path);
        const data = await dataReq.json();
        Object.assign(this.globalData, data);
    }

    readElement(el) {
        return {
            dom: el,
            originalHTML: el.innerHTML,
            componentName: el.dataset.bookshopLive,
            componentPropSource: el.dataset.bookshopProps,
        }
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
        await this.render(options);
    }

    async render(options = {}) {
        options = {
            editorLinks: true,
            ...options
        };

        const updates = await core.renderComponentUpdates(this, document);

        // Go through the rendered components and apply them depth first,
        // skipping the update if no work needs to be done.
        for (let { startNode, endNode, output, pathStack } of updates) {
            if (options.editorLinks) {
                await core.hydrateEditorLinks(this, output, pathStack, startNode.cloneNode(), endNode.cloneNode());
            }

            if (core.buildDigest(startNode, endNode) === output.innerHTML) {
                continue;
            }

            core.replaceHTMLRegion(startNode, endNode, output);
        }
    }
}
