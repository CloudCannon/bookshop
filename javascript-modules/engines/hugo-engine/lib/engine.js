import compressedHugoWasm from "../full-hugo-renderer/hugo_renderer.wasm.gz";
import { gunzipSync } from 'fflate';
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

let mapHugoVariablesToParams = (obj, path) => {
    let resolved = {};
    for (let [k, v] of Object.entries(obj)) {
        if (k.startsWith('$')) {
            const remapped = `__bksh_${k.substring(1)}`;
            obj[remapped] = v;
            resolved[k] = `${path}.${remapped}`;
        } else {
            if (v && typeof v === 'object' && !Array.isArray(v)) {
                resolved = { ...resolved, ...mapHugoVariablesToParams(v, `${path}.${k}`) }
            }
        }
    }
    return resolved
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
        const templates = {
            "layouts/partials/bookshop.html": (await import("../bookshop-hugo-templates/bookshop.html")).default,
            "layouts/partials/bookshop_scss.html": (await import("../bookshop-hugo-templates/bookshop_scss.html")).default,
            "layouts/partials/bookshop_partial.html": (await import("../bookshop-hugo-templates/bookshop_partial.html")).default,
            "layouts/partials/bookshop_component_browser.html": (await import("../bookshop-hugo-templates/bookshop_component_browser.html")).default,
            "layouts/partials/bookshop_bindings.html": (await import("../bookshop-hugo-templates/bookshop_bindings.html")).default,
            "layouts/partials/_bookshop/helpers/component.html": (await import("../bookshop-hugo-templates/helpers/component.html")).default,
            "layouts/partials/_bookshop/helpers/component_key.html": (await import("../bookshop-hugo-templates/helpers/component_key.html")).default,
            "layouts/partials/_bookshop/helpers/partial.html": (await import("../bookshop-hugo-templates/helpers/partial.html")).default,
            "layouts/partials/_bookshop/helpers/partial_key.html": (await import("../bookshop-hugo-templates/helpers/partial_key.html")).default,
            "layouts/partials/_bookshop/errors/bad_bookshop_tag.html": (await import("../bookshop-hugo-templates/errors/bad_bookshop_tag.html")).default,
            "layouts/partials/_bookshop/errors/err.html": (await import("../bookshop-hugo-templates/errors/err.html")).default,
        };

        templates["config.toml"] = "params.env_bookshop_live = true";

        // When this script is run locally, the hugo wasm is loaded as binary rather than output as a file.
        if (compressedHugoWasm?.constructor === Uint8Array) {
            await this.initializeInlineHugo();
        } else {
            await this.initializeLocalCompressedHugo();
        }

        // TODO: Tidy
        const mappedFiles = {};
        for (const file of Object.entries(this.files)) {
            mappedFiles[`layouts/partials/bookshop/${file[0]}`] = translateTextTemplate(file[1], {});
        }

        const componentSuccess = window["writeHugoFiles"](JSON.stringify(mappedFiles));
        const templateSuccess = window["writeHugoFiles"](JSON.stringify(templates));
    }

    async initializeLocalCompressedHugo() {
        try {

            let prefetched = {};
            if (typeof window !== "undefined" && window?.CloudCannon && window?.CloudCannon?.prefetchedFiles) {
                prefetched = await window.CloudCannon.prefetchedFiles?.();
                this.availablePrefetchKeys = Object.keys(prefetched);
            }

            const go = new Go();
            const compressedWasmOrigin = this.origin.replace(/\/[^\.\/]+\.(min\.)?js/, compressedHugoWasm.replace(/^\./, ''));
            const compressedWasmPath = (new URL(compressedWasmOrigin)).pathname;

            let compressedBuffer;
            if (prefetched[compressedWasmPath]) {
                compressedBuffer = await prefetched[compressedWasmPath]?.arrayBuffer();
                this.loadedFrom = "prefetch";
            } else {
                const compressedResponse = await fetch(compressedWasmOrigin);
                compressedBuffer = await compressedResponse.arrayBuffer();
                this.loadedFrom = "network";
            }

            const renderer = gunzipSync(new Uint8Array(compressedBuffer));

            // Check the magic word at the start of the buffer as a way to verify the CDN download worked.
            const isWasm = ([...renderer.slice(0, 4)]).map(g => g.toString(16).padStart(2, '0')).join('') === "0061736d";
            if (!isWasm) throw "Not WASM";

            const compressedResult = await WebAssembly.instantiate(renderer, go.importObject);
            go.run(compressedResult.instance);
        } catch (e) {
            console.error("Couldn't load the local compressed Hugo WASM");
            console.error(e);
        }
    }

    async initializeInlineHugo() {
        const go = new Go();
        const buffer = compressedHugoWasm.buffer;
        const renderer = gunzipSync(new Uint8Array(buffer));
        const result = await WebAssembly.instantiate(renderer, go.importObject);
        go.run(result.instance);
    }

    getSharedKey(name) {
        return `shared/hugo/${name}.hugo.html`;
    }

    getShared(name) {
        const key = this.getSharedKey(name);
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

    hasShared(name) {
        const key = this.getSharedKey(name);
        return !!this.files?.[key];
    }

    resolveComponentType(name) {
        if (this.hasComponent(name)) return 'component';
        if (this.hasShared(name)) return 'shared';
        return false;
    }

    transformData(data) {
        return {
            Params: data
        };
    }

    async storeMeta(meta = {}) {
        while (!window.writeHugoFiles) {
            await sleep(100);
        };
        window.writeHugoFiles(JSON.stringify({
            "config.toml": [
                meta.baseurl ? `baseURL = ${meta.baseurl}` : "",
                meta.copyright ? `copyright = ${meta.copyright}` : "",
                meta.title ? `title = ${meta.title}` : "",
                "params.env_bookshop_live = true"
            ].join('\n')
        }));
        const err = window.initHugoConfig();
        if (err) {
            console.error(err);
        }

        // window.loadHugoBookshopMeta(JSON.stringify(meta));
    }

    async storeInfo(info = {}) {
        while (!window.writeHugoFiles) {
            await sleep(100);
        };

        const data = info?.data;
        if (!data || typeof data !== "object") return;
        const files = {};
        for (const [file, contents] of Object.entries(data)) {
            files[`data/${file}.json`] = JSON.stringify(contents);
        }
        window.writeHugoFiles(JSON.stringify(files));
    }

    /**
     * Tries to parse an error message and patch up the components
     * in a rudimentary way before a rebuild.
     */
    async componentQuack(error_string = "", log_messages = []) {
        try {
            const component_regex = /execute of template failed: template: ([^:]+):\d/ig;
            let file_stack = [...error_string.matchAll(component_regex)].map(([, file]) => `layouts/${file}`);
            if (file_stack.length) {
                const deepest_errored_component = file_stack[file_stack.length-1];
                const error_chunks = error_string.split("execute of template failed:");
                const error_msg = error_chunks[error_chunks.length-1] ?? "template error";
                window.writeHugoFiles(JSON.stringify({
                    [deepest_errored_component]: [
                        `<div style="padding: 10px; background-color: lightcoral; color: black; font-weight: bold;">`,
                        `Failed to render ${deepest_errored_component}. <br/>`,
                        `<pre style="margin-top: 10px; background-color: lightcoral; border: solid 1px black;">`,
                        `<code style="font-family: monospace; color: black;">${error_msg.replace(/</, '&lt;')}</code></pre>`,
                        `</div>`
                    ].join('\n')
                }));
                return deepest_errored_component;
            }

            const error_logs = log_messages.filter(log => log.startsWith("ERROR")).join("\n");
            const missing_regex = /Component "([^"]+)" does not exist/ig;
            file_stack = [...error_logs.matchAll(missing_regex)].map(([, file]) => `layouts/partials/bookshop/components/${file}/${file}.hugo.html`);
            if (file_stack.length) {
                const deepest_errored_component = file_stack[file_stack.length-1];
                window.writeHugoFiles(JSON.stringify({
                    [deepest_errored_component]: [
                        `<div class="bookshop_error" style="padding: 10px; background-color: lightcoral; color: black; font-weight: bold;">`,
                        `Failed to find component ${deepest_errored_component}`,
                        `</div>`
                    ].join('\n')
                }));
                return deepest_errored_component;
            }
        } catch (e) {
            console.error(`ComponentQuack failed to patch things up: ${e}`);
            return null;
        }
    }

    async render(target, name, props, globals, logger) {
        while (!window.buildHugo) {
            logger?.log?.(`Waiting for the Hugo WASM to be available...`);
            await sleep(100);
        };

        let writeFiles = {};

        if (this.hasComponent(name)) {
            writeFiles["layouts/index.html"] = `{{ partial "bookshop" (slice "${name}" .Params.component) }}`
        } else if (this.hasShared(name)) {
            writeFiles["layouts/index.html"] = `{{ partial "bookshop_partial" (slice "${name}" .Params.component) }}`
        } else {
            console.warn(`[hugo-engine] No component found for ${name}`);
            return "";
        }
        logger?.log?.(`Going to render ${name}, with layout:`);
        logger?.log?.(writeFiles["layouts/index.html"]);

        if (!globals || typeof globals !== "object") globals = {};
        props = {
            ...globals, ...props,
            env_bookshop_live: true
        };

        // If we have assigned a root scope we need to pass that in as the context
        if (props["."]) props = props["."];
        writeFiles["content/_index.md"] = JSON.stringify({
            component: props
        }, null, 2) + "\n";
        window.writeHugoFiles(JSON.stringify(writeFiles));

        window.hugo_wasm_logging = [];
        let render_attempts = 1;
        let buildError = window.buildHugo();
        while (buildError && render_attempts < 5) {
            if (this.componentQuack(buildError, window.hugo_wasm_logging) === null) {
                // Can't find a template to overwrite and re-render
                break;
            }
            // Try render again with the problem template stubbed out
            window.hugo_wasm_logging = [];
            buildError = window.buildHugo();
            render_attempts += 1;
        }

        if (buildError) {
            console.error(buildError);
            return;
        }

        const output = window.readHugoFiles(JSON.stringify([
            "public/index.html"
        ]));

        target.innerHTML = output["public/index.html"];
        return;
    }

    async eval(str, props = [{}], logger) {
        while (!window.buildHugo) await sleep(10);
        let props_obj = props.reduce((a, b) => { return { ...a, ...b } });
        let full_props = props_obj;

        // We're capable of looking up a simple variable
        // (and it's hard to pass to wasm since we store variables on the context)
        if (/^\$/.test(str)) {
            logger?.log?.(`Trying to short circuit to return a variable`);
            if (props_obj[str]) return props_obj[str];
        }

        // If we have assigned a root scope we need to pass that in as the context
        if (props_obj["."]) {
            logger?.log?.(`Nesting the props object into its dot scope`);
            props_obj = props_obj["."];
        }

        if (str === ".") {
            logger?.log?.(`Short circuiting dot notation to return the scope`);
            return props_obj;
        }

        let normalized = this.normalize(str);
        if (typeof normalized === 'object') {
            logger?.log?.(`Digging into the object ${JSON.stringify(normalized)}`);
            const process = async (obj) => {
                for (const [k, v] of Object.entries(obj)) {
                    if (typeof v === "string") {
                        if (/^".*"$/.test(v)) {
                            // Normalized strings look like "\"string\""
                            logger?.log?.(`Unwrapping the string ${k}: ${v}`);
                            obj[k] = JSON.parse(v);
                        } else {
                            // No inner quotes means it needs to be evaled again
                            logger?.log?.(`Evaluating the inner ${k}: ${v}`);
                            obj[k] = await this.eval(v, [props_obj], logger.nested());
                        }
                    } else if (typeof v === "object") {
                        logger?.log?.(`Processing the inner object ${k}`);
                    }
                }
            }
            await process(normalized);
            return normalized;
        }
        if (/^\w+(\.\w+)*$/.test(normalized)) {
            logger?.log?.(`Trying to short circuit to return the dot notation ${normalized}`);
            // We're capable of looking up a simple dot notation access
            const result = dig(props_obj, normalized);
            if (result !== undefined) return result
        }

        // Rewrite array.0 into index array 0
        str = str.replace(/(.*)\.(\d+)$/, (_, obj, index) => {
            return `index (${obj}) ${index}`;
        })

        const variable_pairs = mapHugoVariablesToParams(full_props, ".Params.full_props");
        const variable_decl = Object.entries(variable_pairs).map(([k, v]) => {
            return `{{ ${k} := ${v} }}`
        }).join('');

        const assignments = Object.entries(props_obj).filter(([key]) => key.startsWith('$')).map(([key, value]) => {
            if (Array.isArray(value)) {
                return `{{ ${key} := index ( \`{"a": ${JSON.stringify(value)}}\` | transform.Unmarshal ) "a" }}`
            } else if (typeof value === 'object') {
                return `{{ ${key} := \`${JSON.stringify(value)}\` | transform.Unmarshal }}`
            } else {
                return `{{ ${key} := ${JSON.stringify(value)} }}`
            }
        }).join('');
        const eval_str = `${variable_decl}{{ with .Params.props }}${assignments}{{ jsonify (${str}) }}{{ end }}`;
        window.writeHugoFiles(JSON.stringify({
            "layouts/index.html": eval_str,
            "content/_index.md": JSON.stringify({ props: props_obj, full_props: full_props }, null, 2)
        }));

        const buildError = window.buildHugo();
        if (buildError) {
            console.warn(buildError);
            return;
        }

        const output = window.readHugoFiles(JSON.stringify([
            "public/index.html"
        ]))["public/index.html"];

        try {
            return JSON.parse(output);
        } catch (e) {
            logger?.log?.(`Error evaluating \`${str}\` in the Hugo engine`);
            logger?.log?.(output);
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
