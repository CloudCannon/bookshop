import hugoWasm from "../hugo-renderer/hugo_renderer.wasm";
import translateTextTemplate from './translateTextTemplate.js';
import { IdentifierParser } from './hugoIdentifierParser.js';
import { version } from '../package.json';

const sleep = (ms = 0) => {
    return new Promise(r => setTimeout(r, ms));
}

const dig = (obj, path) => {
    if (typeof path === 'string') path = path.replace(/\[(\d+)]/g, '.$1').split('.');
    obj = obj[path.shift()];
    if (obj && path.length) return dig(obj, path);
    return obj;
}

export class Engine {
    constructor(options) {
        options = {
            name: "Hugo",
            files: {},
            ...options,
        };

        this.key = 'hugo';
        this.name = options.name;
        this.files = options.files;
        this.origin = document.currentScript?.src || `/bookshop.js`;

        this.initializeHugo();
    }

    async initializeHugo() {
        const useLocalHugo = window.CloudCannon?.isMocked || /localhost|127\.0\.0\.1/i.test(window.location.host);
        // When this script is run locally, the hugo wasm is loaded as binary rather than output as a file.
        if (hugoWasm?.constructor === Uint8Array) {
            await this.initializeInlineHugo();
        } else {
            if (useLocalHugo) {
                await this.initializeLocalHugo();
            } else {
                await this.initializeRemoteHugo();
            }
        }

        // TODO: Tidy
        const mappedFiles = {};
        for (const file of Object.entries(this.files)) {
            mappedFiles[file[0]] = {
                contents: translateTextTemplate(file[1], {})
            }
        }

        const success = window.loadHugoBookshopPartials(JSON.stringify(mappedFiles));
    }

    async initializeRemoteHugo() {
        try {
            const go = new Go();
            const remoteWasmOrigin = `https://cdn.bookshop.build/hugo/hugo_renderer_${version}.wasm`;
            const remoteResponse = await fetch(remoteWasmOrigin);
            const remoteBuffer = await remoteResponse.arrayBuffer();

            // Check the magic word at the start of the buffer as a way to verify the CDN download worked.
            const isWasm = ([...new Uint8Array(remoteBuffer, 0, 4)]).map(g => g.toString(16).padStart(2, '0')).join('') === "0061736d";
            if (!isWasm) throw "Not WASM";

            const remoteResult = await WebAssembly.instantiate(remoteBuffer, go.importObject);
            go.run(remoteResult.instance);
        } catch (e) {
            await this.initializeLocalHugo();
        }
    }

    async initializeLocalHugo() {
        const go = new Go();
        const wasmOrigin = this.origin.replace(/\/[^\.\/]+\.(min\.)?js/, hugoWasm.replace(/^\./, ''));
        const response = await fetch(wasmOrigin);
        const buffer = await response.arrayBuffer();
        const result = await WebAssembly.instantiate(buffer, go.importObject);
        go.run(result.instance);
    }

    async initializeInlineHugo() {
        const go = new Go();
        const buffer = hugoWasm.buffer;
        const result = await WebAssembly.instantiate(buffer, go.importObject);
        go.run(result.instance);
    }

    getShared(name) {
        const key = `shared/hugo/${name}.hugo.html`
        return this.files?.[key];
    }

    getComponentKey(name) {
        const base = name.split("/").reverse()[0];
        return `components/${name}/${base}.hugo.html`;
    }

    getComponent(name) {
        const key = this.getComponentKey(name);
        return this.files?.[key];
    }

    hasComponent(name) {
        const key = this.getComponentKey(name);
        return !!this.files?.[key];
    }

    resolveComponentType(name) {
        if (this.getComponent(name)) return 'component';
        if (this.getShared(name)) return 'shared';
        return false;
    }

    transformData(data) {
        return {
            Params: data
        };
    }

    async storeMeta(meta = {}) {
        while (!window.loadHugoBookshopMeta) {
            await sleep(100);
        };
        window.loadHugoBookshopMeta(JSON.stringify(meta));
    }

    async storeInfo(info = {}) {
        while (!window.loadHugoBookshopData) {
            await sleep(100);
        };
        window.loadHugoBookshopData(JSON.stringify(info));
    }

    async render(target, name, props, globals, logger) {
        while (!window.renderHugo) {
            logger?.log?.(`Waiting for the Hugo WASM to be available...`);
            await sleep(100);
        };

        let source = this.getComponent(name);
        // TODO: Remove the below check and update the live comments to denote shared
        if (!source) source = this.getShared(name);
        if (!source) {
            console.warn(`[hugo-engine] No component found for ${name}`);
            return "";
        }
        logger?.log?.(`Going to render ${name}, with source:`);
        logger?.log?.(source);
        // TODO: this template already exists on the other side of the wasm bounary
        source = translateTextTemplate(source, {});
        logger?.log?.(`Rewritten the template for ${name} to:`);
        logger?.log?.(source);
        if (!globals || typeof globals !== "object") globals = {};
        props = {
            ...globals, ...props,
            env_bookshop_live: true
        };

        // If we have assigned a root scope we need to pass that in as the context
        if (props["."]) props = props["."];
        const output = window.renderHugo(source, JSON.stringify(props));
        if (/BKSHERR/.test(output)) {
            logger?.log?.(`Failed to render ${output}`);
            console.error(output);
        } else {
            target.innerHTML = output;
            logger?.log?.(`Rendered ${name} as:`);
            logger?.log?.(target.innerHTML);
        }
    }

    async eval(str, props = [{}]) {
        while (!window.renderHugo) await sleep(10);
        let props_obj = props.reduce((a, b) => { return { ...a, ...b } });

        // We're capable of looking up a simple variable
        // (and it's hard to pass to wasm since we store variables on the context)
        if (/^\$/.test(str)) {
            return props_obj[str] ?? null;
        }

        // If we have assigned a root scope we need to pass that in as the context
        if (props_obj["."]) props_obj = props_obj["."];

        // Rewrite array.0 into index array 0
        str = str.replace(/(.*)\.(\d+)$/, (_, obj, index) => {
            return `index (${obj}) ${index}`;
        })

        const assignments = Object.entries(props_obj).filter(([key]) => key.startsWith('$')).map(([key, value]) => {
            if (Array.isArray(value)) {
                return `{{ ${key} := index ( \`{"a": ${JSON.stringify(value)}}\` | transform.BookshopUnmarshal ) "a" }}`
            } else if (typeof value === 'object') {
                return `{{ ${key} := \`${JSON.stringify(value)}\` | transform.BookshopUnmarshal }}`
            } else {
                return `{{ ${key} := ${JSON.stringify(value)} }}`
            }
        }).join('');
        const eval_str = `${assignments}{{ jsonify (${str}) }}`;
        const output = window.renderHugo(eval_str, JSON.stringify(props_obj));

        try {
            return JSON.parse(output);
        } catch (e) {
            console.warn(`Error evaluating \`${str}\` in the Hugo engine`, output);
            return null;
        }
    }

    normalize(str) {
        return (new IdentifierParser(str)).build();
    }

    loader() {
        // esbuild loader if required
    }
}
