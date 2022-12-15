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
    for (let [k,v] of Object.entries(obj)) {
        if (k.startsWith('$')) {
            const remapped = `__bksh_${k.substring(1)}`;
            obj[remapped] = v;
            resolved[k] = `${path}.${remapped}`;
        } else {
            if (typeof v === 'object' && !Array.isArray(v)) {
                resolved = {...resolved, ...mapHugoVariablesToParams(v, `${path}.${k}`)}
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
            const go = new Go();
            const compressedWasmOrigin = this.origin.replace(/\/[^\.\/]+\.(min\.)?js/, compressedHugoWasm.replace(/^\./, ''));
            const compressedResponse = await fetch(compressedWasmOrigin);
            const compressedBuffer = await compressedResponse.arrayBuffer();
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

        const buildResult = window.buildHugo();
        if (buildResult) {
            console.error(buildResult);
            return;
        }

        const output = window.readHugoFiles(JSON.stringify([
            "public/index.html"
        ]));

        target.innerHTML = output["public/index.html"];
        return;

        const outputs = window.renderHugo(source, JSON.stringify(props));
        if (/BKSHERR/.test(output)) {
            logger?.log?.(`Failed to render ${output}`);
            console.error(output);
        } else {
            target.innerHTML = output;
            logger?.log?.(`Rendered ${name} as:`);
            logger?.log?.(target.innerHTML);
        }
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
            const process = async (obj)  => {
                for (const [k,v] of Object.entries(obj)) {
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
        const variable_decl = Object.entries(variable_pairs).map(([k,v]) => {
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
