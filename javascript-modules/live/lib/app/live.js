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
        this.cloudcannonInfo = {};
        this.renderOptions = {};
        this.renderCount = 0;
        this.renderedAt = 0;
        this.shouldRenderAt = null;
        this.renderFrequency = 1000;
        this.renderTimeout = null;
        this.verbose = false;
        this.lastLog = Date.now();
        this.storedMeta = false;

        this.memo = {};

        this.logFn = this.logger();
        this.loadedFn = options?.loadedFn;

        const remoteGlobals = options?.remoteGlobals?.length || 0;
        this.awaitingDataFetches = remoteGlobals + 1;
        options?.remoteGlobals?.forEach(this.fetchGlobalData.bind(this));
        this.fetchInfo();
    }

    completeRender() {
        if (typeof this.loadedFn === 'function') {
            this.loadedFn();
            this.loadedFn = null;
        }
        this.renderCount += 1;
    }

    logger(depth = 0) {
        return {
            log: (str) => {
                if (this.verbose || (typeof window !== 'undefined' && window?.bookshopLiveVerbose)) {
                    console.log(`+${Date.now() - this.lastLog}ms : ${'|  '.repeat(depth)}${str}`);
                }
                this.lastLog = Date.now();
            },
            nested: () => this.logger(depth + 1)
        }
    }

    async fetchInfo() {
        try {
            this.logFn.log(`Trying to load /_cloudcannon/info.json`);
            const dataReq = await fetch(`/_cloudcannon/info.json`);
            this.cloudcannonInfo = await dataReq.json();
            await this.engines[0].storeInfo?.(this.cloudcannonInfo);
            this.awaitingDataFetches -= 1;
            this.logFn.log(`Loaded /_cloudcannon/info.json`);
        } catch (e) {
            this.awaitingDataFetches -= 1;
            this.logFn.log(`❌ Failed to load /_cloudcannon/info.json`);
        }
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

    async storeMeta(meta) {
        await this.engines[0].storeMeta?.(meta);
    }

    async renderElement(componentName, scope, dom, logger) {
        try {
            logger?.log?.(`Rendering ${componentName}`);
            await this.engines[0].render(dom, componentName, scope, { ...this.globalData }, logger?.nested?.());
            logger?.log?.(`Rendered ${componentName}`);
        } catch (e) {
            logger?.log?.(`Error rendering ${componentName}`);
            console.warn(`Error rendering bookshop component ${componentName}`, e.toString());
            console.warn(`This is expected in certain cases, and may not be an issue, especially when deleting or re-ordering components.`)
        }
    }

    async eval(identifier, scope, logger) {
        logger?.log?.(`Evaluating ${identifier} in ${JSON.stringify(scope)}`);
        const result = await this.engines[0].eval(identifier, scope, logger);
        logger?.log?.(`Evaluated to ${JSON.stringify(result)}`);
        return result;
    }

    normalize(identifier, logger) {
        const key = `Normalizing ${identifier}`;
        logger?.log?.(key);
        if (typeof this.engines[0].normalize === 'function') {
            if (!this.memo[key]) {
                identifier = this.engines[0].normalize(identifier);
                this.memo[key] = identifier;
            } else {
                identifier = this.memo[key];
            }
            logger?.log?.(`Normalized to ${typeof identifier === "object" ? "json: " + JSON.stringify(identifier) : identifier}`);
        }
        return identifier;
    }

    async update(data, options) {
        this.logFn.log(`Received new data to update the page with`);
        const now = Date.now();
        // transformData = false means implementations like Jekyll 
        // won't wrap the data in { page: {} }
        // (this is currently only used for tests)
        if (typeof this.engines[0].transformData === 'function'
            && options?.transformData !== false) {
            this.data = this.engines[0].transformData(data);
            this.logFn.log(`Transformed the data using the engine's transform function`);
        } else {
            this.data = data;
        }
        this.renderOptions = options;
        while (this.awaitingDataFetches > 0) {
            this.logFn.log(`Still fetching remote data, waiting for all fetches to complete...`);
            await sleep(100);
        }
        if (now - this.renderedAt < this.renderFrequency) {
            const shouldRenderAt = this.renderedAt + this.renderFrequency;
            this.shouldRenderAt = shouldRenderAt;
            this.logFn.log(`Throttling this render — will try to render again in ${shouldRenderAt - now}ms`);
            await sleep(shouldRenderAt - now);
            if (shouldRenderAt !== this.shouldRenderAt) {
                // We have a newer update() call running, so we can bail on this render.
                this.logFn.log(`A newer render has schedule itself — throwing away this render attempt`);
                return false;
            }
            this.logFn.log(`Now running previously throttled render`);
        }
        const realNow = Date.now();
        this.shouldRenderAt = null;
        this.renderedAt = Date.now();
        this.logFn.log(`Rendering the update`);
        await this.render();
        this.logFn.log(`Done rendering in ${Date.now() - realNow}ms (${Date.now() - now}ms throttled)`);
        return true;
    }

    async render() {
        const CCEditorPanelSupport = typeof window === 'undefined' || typeof window !== 'undefined' && window.CloudCannon?.refreshInterface;
        this.logFn.log(CCEditorPanelSupport ? `Editor panels are supported` : `Editor panels are not supported`);
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

        this.logFn.log(options.dataBindings ? `Data bindings are enabled` : `Data bindings are disabled`);
        this.logFn.log(`Rendering component updates...`);

        // Render _all_ components found on the page into virtual DOM nodes
        // Returned in depth-first ordering. Children will be listed before their parents,
        // which allows parents to _not_ re-render if only a child changed.
        const componentUpdates = await core.renderComponentUpdates(this, document, this.logFn.nested());
        this.logFn.log(`Individual component updates have been rendered`);

        for (let {
            startNode,  // The bookshop-live comment before this component's location in real-DOM
            endNode,    // The bookshop-live end comment following this component's location in real-DOM
            output,     // A virtual-DOM node containing contents of the just-rendered component
            pathStack,  // Any "absolute paths" to data in scope for this component
            stashedNodes, // Any bookshop_bindings tags that were applied to this component
            name,       // The name of this component being rendered
        } of componentUpdates) {
            this.logFn.log(`Processing a component update for ${name}`);
            if (options.dataBindings) { // If we should be adding data bindings _in general_
                // Re-traverse this component to inject any data bindings we can to it or its children.
                this.logFn.log(`Hydrating the data bindings for ${name}`);
                await core.hydrateDataBindings(this, output, pathStack, startNode.cloneNode(), endNode.cloneNode(), stashedNodes.map(n => n.cloneNode()), this.logFn.nested());
            }
            this.logFn.log(`Grafting ${name}'s update to the DOM tree`);
            core.graftTrees(startNode, endNode, output, this.logFn.nested());
            this.logFn.log(`Completed grafting ${name}'s update to the DOM tree`);
        }
        this.completeRender();
        this.logFn.log(`Finished rendering`);
    }
}
