import compressedHugoWasm from "../full-hugo-renderer/hugo_renderer.wasm.gz";
import { gunzipSync } from 'fflate';
import translateTextTemplate from './translateTextTemplate.js';
import { IdentifierParser } from './hugoIdentifierParser.js';

const verboseLog = (message, ...args) => {
    if (typeof window !== 'undefined' && window?.bookshopLiveVerbose) {
        console.log(message, ...args);
    }
};

const UNIFIED_LAYOUT = [
    `{{ if .Params.components }}`,
        `{{ range $i, $c := .Params.components }}`,
            `<script type="bookshop/batch" data-batch="{{ $.Params.batch_id }}" data-id="{{ $i }}" data-pos="start"></script>`,
            `{{ if eq $c.type "component" }}`,
                `{{ partial "bookshop" (slice $c.name $c.props) }}`,
            `{{ else }}`,
                `{{ partial "bookshop_partial" (slice $c.name $c.props) }}`,
            `{{ end }}`,
            `<script type="bookshop/batch" data-batch="{{ $.Params.batch_id }}" data-id="{{ $i }}" data-pos="end"></script>`,
        `{{ end }}`,
    `{{ else if .Params.bookshop_name }}`,
        `{{ if eq .Params.bookshop_type "shared" }}`,
            `{{ partial "bookshop_partial" (slice .Params.bookshop_name .Params.component) }}`,
        `{{ else }}`,
            `{{ partial "bookshop" (slice .Params.bookshop_name .Params.component) }}`,
        `{{ end }}`,
    `{{ else if .Params.bookshop_eval }}`,
        `{{ partial "bookshop_eval_expr" . }}`,
    `{{ end }}`
].join('');

const ensureUnifiedLayoutInstalled = () => {
    if (typeof window === 'undefined') return {};
    if (window.__bookshop_unified_layout_installed) return {};

    window.__bookshop_unified_layout_installed = true;
    verboseLog('[hugo-engine] Installing unified static layout');
    return { "layouts/all.html": UNIFIED_LAYOUT };
};

/**
 * Build Hugo with retry logic using componentQuack for error recovery.
 * @param {Engine} engine - The engine instance for componentQuack access
 * @param {string} context - Description for logging (e.g., "rendering" or "batch rendering")
 * @param {Object|null} contentFiles - The content files this build renders. Rewritten before
 *   each retry: componentQuack may stub out a template that didn't exist before, and pages
 *   don't depend on templates they failed to find, so the page must be invalidated directly.
 * @returns {Promise<string|null>} - The build error if unrecoverable, or null on success
 */
const buildHugoWithRetry = async (engine, context = "rendering", contentFiles = null) => {
    let render_attempts = 1;
    let { error: buildError, logging } = await engine.buildWasm();
    while (buildError && render_attempts < 5) {
        console.warn(`Hit a build error when ${context} Hugo:\n${logging.map(l => `  ${l}`).join('\n')}`);
        if (await engine.componentQuack(buildError, logging) === null) {
            // Can't find a template to overwrite and re-render
            break;
        }
        // Try render again with the problem template stubbed out
        if (contentFiles) {
            await engine.wasm.writeFiles(JSON.stringify(contentFiles));
        }
        ({ error: buildError, logging } = await engine.buildWasm());
        render_attempts += 1;
    }
    return buildError;
};

const sleep = (ms = 0) => {
    return new Promise(r => setTimeout(r, ms));
}

// The Go runtime source, injected at build time (see lib/builder.js). Only
// present in the bundled browser build; undefined under plain Node (unit tests).
const WASM_EXEC_SOURCE = (typeof __BOOKSHOP_WASM_EXEC_SOURCE__ !== 'undefined')
    ? __BOOKSHOP_WASM_EXEC_SOURCE__
    : null;

// The body of the Web Worker that hosts the Hugo WASM. It receives the
// (decompressed) wasm bytes once, instantiates them, then answers one message
// per filesystem/build operation. Each build's log output is captured and
// returned alongside the result. Kept as a string so it can be wrapped in a
// Blob together with the Go runtime source — no separate asset to host.
const HUGO_WORKER_BODY = `
self.window = self; // wasm_exec.js writes its log capture onto window
self.__ready = false;
self.onmessage = async (e) => {
    const { id, op, payload, bytes } = e.data;
    try {
        if (op === 'init') {
            const go = new self.Go();
            const { instance } = await WebAssembly.instantiate(bytes, go.importObject);
            go.run(instance);
            // Wait for the Go program to register its globals, but don't wait
            // forever — if go.run failed or the module didn't install buildHugo,
            // report it so the main thread can fall back rather than hang.
            let waited = 0;
            while (!self.buildHugo) {
                if (waited >= 15000) throw new Error('Hugo WASM did not register buildHugo after go.run');
                await new Promise(r => setTimeout(r, 5));
                waited += 5;
            }
            self.__ready = true;
            self.postMessage({ id, ok: true });
            return;
        }
        self.hugo_wasm_logging = [];
        let result = null;
        if (op === 'write') result = self.writeHugoFiles(payload);
        else if (op === 'build') result = self.buildHugo();
        else if (op === 'read') result = self.readHugoFiles(payload);
        else if (op === 'remove') result = self.removeHugoFiles(payload);
        else if (op === 'initConfig') result = self.initHugoConfig();
        else throw new Error('Unknown Hugo WASM worker op: ' + op);
        self.postMessage({ id, ok: true, result, logging: self.hugo_wasm_logging || [] });
    } catch (err) {
        self.postMessage({ id, ok: false, error: String(err && err.stack || err) });
    }
};
`;

/**
 * Runs the Hugo WASM inside a dedicated Web Worker so that buildHugo() — which
 * can take seconds on a large page — never blocks the main (UI) thread.
 * All operations are serialized through a queue, preserving the strict
 * write -> build -> read ordering the in-memory filesystem relies on.
 */
class WorkerHugo {
    constructor(wasmBytes) {
        this.wasmBytes = wasmBytes;
        this.pending = new Map();
        this.msgId = 0;
        this.queue = Promise.resolve();
    }

    async init() {
        const source = WASM_EXEC_SOURCE + "\n" + HUGO_WORKER_BODY;
        const blob = new Blob([source], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        this.worker = new Worker(url);
        this.worker.onmessage = (e) => {
            const p = this.pending.get(e.data.id);
            if (p) { this.pending.delete(e.data.id); p.resolve(e.data); }
        };
        // A worker that fails to load/parse/execute (CSP, syntax error, uncaught
        // error) never replies, so reject all pending calls rather than hang —
        // this is what lets createBackend fall back to the inline backend.
        this.worker.onerror = (e) => this._fail(new Error(`Hugo WASM worker error: ${e.message || e.type || 'unknown'}`));
        this.worker.onmessageerror = () => this._fail(new Error('Hugo WASM worker received an uncloneable message'));

        // Hand the wasm bytes over (transferred, not copied) and wait for the
        // module to instantiate, with a ceiling so a silently-dead worker (never
        // replies at all) still rejects instead of hanging init forever.
        const buffer = this.wasmBytes.buffer;
        this.wasmBytes = null;
        const timer = setTimeout(() => {
            this._fail(new Error('Hugo WASM worker init timed out'));
            try { this.worker.terminate(); } catch { /* ignore */ }
        }, 20000);
        try {
            await this._enqueue({ op: 'init' }, [buffer], buffer);
        } finally {
            URL.revokeObjectURL(url);
            clearTimeout(timer);
        }
    }

    // Reject every in-flight call and refuse further ones. Idempotent.
    _fail(err) {
        if (this.failed) return;
        this.failed = err;
        for (const p of this.pending.values()) p.reject(err);
        this.pending.clear();
    }

    // Post a single message and settle when its reply arrives (or when the
    // worker dies, via _fail).
    _post(message, transfer) {
        return new Promise((resolve, reject) => {
            if (this.failed) { reject(this.failed); return; }
            const id = ++this.msgId;
            this.pending.set(id, { resolve, reject });
            this.worker.postMessage({ id, ...message }, transfer || []);
        });
    }

    // Chain onto the queue so operations never interleave on the shared FS.
    // A worker-side exception (WASM panic, handler error) comes back as
    // { ok: false } and is surfaced as a thrown error rather than silently
    // returning undefined. The queue itself is kept alive so a failed op
    // doesn't wedge later ones.
    _enqueue(message, transfer, bytes) {
        const run = () => this._post(bytes ? { ...message, bytes } : message, transfer);
        const result = this.queue.then(run, run).then((reply) => {
            if (reply && reply.ok === false) {
                throw new Error(`Hugo WASM worker failed during "${message.op}": ${reply.error}`);
            }
            return reply;
        });
        this.queue = result.catch(() => {});
        return result;
    }

    async writeFiles(json) { return (await this._enqueue({ op: 'write', payload: json })).result; }
    async readFiles(json) { return (await this._enqueue({ op: 'read', payload: json })).result; }
    async removeFiles(json) { return (await this._enqueue({ op: 'remove', payload: json })).result; }
    async initConfig() { return (await this._enqueue({ op: 'initConfig' })).result; }
    async build() {
        const reply = await this._enqueue({ op: 'build' });
        return { error: reply.result || null, logging: reply.logging || [] };
    }
}

/**
 * Runs the Hugo WASM on the current thread via the globals wasm_exec installs.
 * Used for the Node unit tests and as a fallback when a Web Worker can't be
 * created (e.g. a restrictive Content-Security-Policy). Behaviour matches the
 * original synchronous implementation.
 */
class InlineHugo {
    constructor(wasmBytes) {
        this.wasmBytes = wasmBytes;
        // wasm_exec installs the Hugo globals (buildHugo, writeHugoFiles, …) on
        // the global object; resolve it once and use it consistently in both
        // init and the operations below.
        this.g = (typeof window !== 'undefined') ? window : globalThis;
    }

    async init() {
        const go = new Go();
        const result = await WebAssembly.instantiate(this.wasmBytes, go.importObject);
        this.wasmBytes = null;
        go.run(result.instance);
        while (!this.g.buildHugo) {
            await sleep(10);
        }
    }

    async writeFiles(json) { return this.g.writeHugoFiles(json); }
    async readFiles(json) { return this.g.readHugoFiles(json); }
    async removeFiles(json) { return this.g.removeHugoFiles(json); }
    async initConfig() { return this.g.initHugoConfig(); }
    async build() {
        this.g.hugo_wasm_logging = [];
        const error = this.g.buildHugo();
        return { error: error || null, logging: this.g.hugo_wasm_logging || [] };
    }
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
        this.extraFiles = options.extraFiles;
        this.origin = (typeof document === 'undefined' ? '' : document.currentScript?.src) || `/bookshop.js`;
        this.synthetic = options.synthetic ?? false;

        // eval() is a pure function of (expression, props) — unless the expression
        // reaches outside its props. Results are cached across live updates, and
        // dataGeneration invalidates the cache whenever site data, config, or
        // templates change underneath us.
        this.evalCache = new Map();
        this.dataGeneration = 0;

        // Number of Hugo WASM builds run, for perf instrumentation/tests.
        this.wasmBuildCount = 0;

        if (!this.synthetic) {
            // Kick off initialization; render()/eval()/storeMeta() await this.
            this.ready = this.initializeHugo();
        }
    }

    // A single Hugo build, tracked and routed through the active backend.
    async buildWasm() {
        this.wasmBuildCount += 1;
        return this.wasm.build();
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
            "layouts/partials/_bookshop/helpers/flat_component_key.html": (await import("../bookshop-hugo-templates/helpers/flat_component_key.html")).default,
            "layouts/partials/_bookshop/helpers/partial.html": (await import("../bookshop-hugo-templates/helpers/partial.html")).default,
            "layouts/partials/_bookshop/helpers/partial_key.html": (await import("../bookshop-hugo-templates/helpers/partial_key.html")).default,
            "layouts/partials/_bookshop/errors/bad_bookshop_tag.html": (await import("../bookshop-hugo-templates/errors/bad_bookshop_tag.html")).default,
            "layouts/partials/_bookshop/errors/err.html": (await import("../bookshop-hugo-templates/errors/err.html")).default,
        };

        templates["config.toml"] = [
            "params.env_bookshop_live = true",
            "markup.goldmark.renderer.unsafe = true",
            `disableKinds = ["taxonomy", "term", "RSS", "sitemap", "robotsTXT", "404"]`
        ].join('\n');

        // Obtain the decompressed WASM bytes, then hand them to a backend that
        // runs the module either in a Web Worker (off the main thread — the
        // default in the browser) or inline (unit tests / Worker unavailable).
        const wasmBytes = await this.loadWasmBytes();
        this.wasm = await this.createBackend(wasmBytes);

        // TODO: Tidy
        const mappedFiles = {};
        for (const file of Object.entries(this.files)) {
            mappedFiles[`layouts/partials/bookshop/${file[0]}`] = translateTextTemplate(file[1], {});
        }

        await this.wasm.writeFiles(JSON.stringify(mappedFiles));
        await this.wasm.writeFiles(JSON.stringify(templates));
        await this.wasm.writeFiles(JSON.stringify(this.extraFiles));

        // BIG OL' TODO: Writing these files ahead of render() seems to be load-bearing,
        // which doesn't yet make sense to me.
        // If these files are created for the first time in render(), the site doesn't
        // appear to build (need to extract some logs from hugo to determine why).
        // Perplexingly, writing then building in eval() appears to have been working
        // fine in the same case.
        // My suspicion would be something around our changeEvents() handling
        // in the Hugo builder, but I don't know why that wouldn't affect eval()... 🤷‍♂️
        // For now, the load-bearing stubs will live in this Hugo initialization.
        await this.wasm.writeFiles(JSON.stringify({
            "layouts/all.html": "Uninitialized Layout",
            "content/_index.md": "{ \"initialized\": false }\n"
        }));
    }

    // Pick a backend: a Web Worker where possible (keeps buildHugo off the UI
    // thread), otherwise inline. Any failure creating the worker degrades
    // gracefully to the inline backend.
    async createBackend(wasmBytes) {
        const workerable = typeof Worker !== 'undefined'
            && typeof Blob !== 'undefined'
            && typeof URL !== 'undefined'
            && typeof URL.createObjectURL === 'function'
            && WASM_EXEC_SOURCE;
        if (workerable) {
            try {
                const backend = new WorkerHugo(wasmBytes.slice());
                await backend.init();
                this.backendKind = 'worker';
                return backend;
            } catch (e) {
                console.warn("[hugo-engine] Web Worker unavailable, running Hugo WASM inline", e);
            }
        }
        const inline = new InlineHugo(wasmBytes);
        await inline.init();
        this.backendKind = 'inline';
        return inline;
    }

    // Returns the decompressed Hugo WASM as a Uint8Array. Inline builds embed
    // the gzipped bytes directly; hosted builds fetch the .wasm.gz (optionally
    // from the CloudCannon prefetch cache).
    async loadWasmBytes() {
        if (compressedHugoWasm?.constructor === Uint8Array) {
            return gunzipSync(new Uint8Array(compressedHugoWasm.buffer));
        }
        return this.fetchCompressedWasmBytes(true);
    }

    async fetchCompressedWasmBytes(usePrefetch) {
        try {
            let prefetched = {};
            if (typeof window !== "undefined" && window?.CloudCannon && window?.CloudCannon?.prefetchedFiles) {
                prefetched = await window.CloudCannon.prefetchedFiles?.();
                this.availablePrefetchKeys = Object.keys(prefetched);
            }

            const compressedWasmOrigin = this.origin.replace(/\/[^\.\/]+\.(min\.)?js/, compressedHugoWasm.replace(/^\./, ''));
            const compressedWasmPath = (new URL(compressedWasmOrigin)).pathname;

            let compressedBuffer;
            if (usePrefetch && prefetched[compressedWasmPath]) {
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

            return renderer;
        } catch (e) {
            console.error(`Couldn't load the compressed Hugo WASM (${usePrefetch ? "prefetch" : "network"})`);
            console.error(e);
            // If the prefetch attempt fails, fall back to fetching over the network
            if (usePrefetch) {
                return this.fetchCompressedWasmBytes(false);
            }
            throw e;
        }
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

    getFlatComponentKey(name) {
        return `components/${name}.hugo.html`;
    }

    getComponent(name) {
        const key = this.getComponentKey(name);
        const flatKey = this.getFlatComponentKey(name);
        return this.files?.[key] ?? this.files?.[flatKey];
    }

    hasComponent(name) {
        const key = this.getComponentKey(name);
        const flatKey = this.getFlatComponentKey(name);
        return !!(this.files?.[key] ?? this.files?.[flatKey]);
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
        await this.ready;
        await this.wasm.writeFiles(JSON.stringify({
            "config.toml": [
                meta.baseurl ? `baseURL = ${meta.baseurl}` : "",
                meta.copyright ? `copyright = ${meta.copyright}` : "",
                meta.title ? `title = ${meta.title}` : "",
                "params.env_bookshop_live = true",
                "markup.goldmark.renderer.unsafe = true",
                `disableKinds = ["taxonomy", "term", "RSS", "sitemap", "robotsTXT", "404"]`
            ].join('\n')
        }));
        const err = await this.wasm.initConfig();
        if (err) {
            console.error(err);
        }
        this.dataGeneration += 1;

        // window.loadHugoBookshopMeta(JSON.stringify(meta));
    }

    async storeInfo(info = {}) {
        await this.ready;

        const data = info?.data;
        if (!data || typeof data !== "object") return;
        const files = {};
        for (const [file, contents] of Object.entries(data)) {
            files[`data/${file}.json`] = JSON.stringify(contents);
        }
        await this.wasm.writeFiles(JSON.stringify(files));
        this.dataGeneration += 1;
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
                const raw_deepest_errored_component = file_stack[file_stack.length - 1];
                // For some reason, in the Hugo bump to v0.147.6, the errors now log as:
                // _partials/bookshop/components/bad/bad.hugo.html:1:7
                // instead of the previous:
                // partials/bookshop/components/bad/bad.hugo.html:1:7
                // So, we now strip that off if it is present.
                const deepest_errored_component = raw_deepest_errored_component.replace(/layouts\/_partials/, 'layouts/partials')
                const error_chunks = error_string.split("execute of template failed:");
                const error_msg = error_chunks[error_chunks.length - 1] ?? "template error";
                this.dataGeneration += 1;
                await this.wasm.writeFiles(JSON.stringify({
                    [deepest_errored_component]: [
                        `<div style="padding: 10px; background-color: lightcoral; color: black; font-weight: bold;">`,
                        `Failed to render ${deepest_errored_component}. <br/>`,
                        `<pre style="margin-top: 10px; background-color: lightcoral; border: solid 1px black; white-space: pre-line;">`,
                        `<code style="font-family: monospace; color: black;">${error_msg.replace(/</, '&lt;')}</code></pre>`,
                        `</div>`
                    ].join('\n')
                }));
                return deepest_errored_component;
            }

            const error_logs = log_messages.filter(log => log.startsWith("ERROR")).join("\n");
            const missing_regex = /Component "([^"]+)" does not exist/ig;
            file_stack = [...error_logs.matchAll(missing_regex)].map(([, file]) => {
                let filename = file.split('/').pop();
                return `layouts/partials/bookshop/components/${file}/${filename}.hugo.html`;
            });
            if (file_stack.length) {
                const deepest_errored_component = file_stack[file_stack.length - 1];
                this.dataGeneration += 1;
                await this.wasm.writeFiles(JSON.stringify({
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
        const uuid = crypto.randomUUID();

        await this.ready;

        const writeFiles = {};
        let componentType = null;

        if (this.hasComponent(name)) {
            componentType = "component";
        } else if (this.hasShared(name)) {
            componentType = "shared";
        } else {
            console.warn(`[hugo-engine] No component found for ${name}`);
            return false;
        }

        Object.assign(writeFiles, ensureUnifiedLayoutInstalled());
        logger?.log?.(`Going to render ${name}`);

        if (!globals || typeof globals !== "object") globals = {};
        props = {
            ...globals, ...props,
            env_bookshop_live: true
        };

        // If we have assigned a root scope we need to pass that in as the context
        if (props["."]) props = props["."];
        const contentFiles = {
            [`content/${uuid}.md`]: JSON.stringify({
                bookshop_name: name,
                bookshop_type: componentType,
                component: props
            }, null, 2) + "\n"
        };
        Object.assign(writeFiles, contentFiles);
        await this.wasm.writeFiles(JSON.stringify(writeFiles));

        const buildError = await buildHugoWithRetry(this, "rendering", contentFiles);
        if (buildError) {
            console.error(buildError);
            return false;
        }

        const outputFileName = `public/${uuid}/index.html`;
        const output = await this.wasm.readFiles(JSON.stringify([outputFileName]));

        target.innerHTML = output[outputFileName];
        await this.wasm.removeFiles(JSON.stringify([outputFileName, `content/${uuid}.md`]));
        return true;
    }

    async renderBatch(components, logger) {
        if (!components || components.length === 0) return;
        
        if (components.length === 1) {
            const c = components[0];
            c.renderedOk = await this.render(c.target, c.name, c.props, c.globals, logger);
            return;
        }

        await this.ready;

        verboseLog(`[hugo-engine] Batch rendering ${components.length} components`);
        
        // Generate a unique batch ID to prevent marker collisions with component content
        const batchId = `b${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
        
        const componentData = components.map((c, index) => {
            const isComponent = this.hasComponent(c.name);
            const isShared = this.hasShared(c.name);

            if (!isComponent && !isShared) {
                console.warn(`[hugo-engine] No component found for ${c.name}`);
                c.renderedOk = false;
                return null;
            }
            
            let props = { ...(c.globals || {}), ...(c.props || {}), env_bookshop_live: true };
            if (props["."]) props = props["."];
            
            return {
                index,
                name: c.name,
                type: isComponent ? 'component' : 'shared',
                props
            };
        }).filter(Boolean);
        
        if (componentData.length === 0) return;
        
        const contentFiles = {
            "content/_index.md": JSON.stringify({
                batch_id: batchId,
                components: componentData.map(c => ({ name: c.name, type: c.type, props: c.props }))
            }, null, 2) + "\n"
        };
        let writeFiles = {
            ...contentFiles,
            ...ensureUnifiedLayoutInstalled()
        };

        await this.wasm.writeFiles(JSON.stringify(writeFiles));

        const buildError = await buildHugoWithRetry(this, "batch rendering", contentFiles);
        if (buildError) {
            console.error(`Batch render error: ${buildError}`);
            verboseLog('[hugo-engine] Falling back to individual renders');
            for (const c of components) {
                c.renderedOk = await this.render(c.target, c.name, c.props, c.globals, logger);
            }
            return;
        }

        const output = await this.wasm.readFiles(JSON.stringify(["public/index.html"]));
        const html = output["public/index.html"];

        for (let i = 0; i < componentData.length; i++) {
            const originalIndex = componentData[i].index;
            const startMarker = `<script type="bookshop/batch" data-batch="${batchId}" data-id="${i}" data-pos="start"></script>`;
            const endMarker = `<script type="bookshop/batch" data-batch="${batchId}" data-id="${i}" data-pos="end"></script>`;
            const startIdx = html.indexOf(startMarker);
            const endIdx = html.indexOf(endMarker);

            if (startIdx !== -1 && endIdx !== -1) {
                const componentHtml = html.substring(startIdx + startMarker.length, endIdx);
                components[originalIndex].target.innerHTML = componentHtml;
                components[originalIndex].renderedOk = true;
            } else {
                verboseLog(`[hugo-engine] Could not find markers for component ${i}, falling back to individual render`);
                const original = components[originalIndex];
                original.renderedOk = await this.render(original.target, original.name, original.props, original.globals, logger);
            }
        }
    }

    async eval(str, props = [{}], logger) {
        if (!this.synthetic) {
            await this.ready;
        }
        let props_obj = props.reduce((a, b) => { return { ...a, ...b } });
        let full_props = props_obj;
        str = str.trim();

        // We can return early if we're evaluating a literal string or digit
        if (/^".*"$|^`.*`$|^\d+(\.\d+)?$|^true$|^false$/.test(str)) {
            logger?.log?.(`Unwrapping the string ${str}`);
            try {
                if (/^`.*`$/.test(str)) {
                    return JSON.parse(str.replace(/^`|`$/g, '"'));
                }
                return JSON.parse(str);
            } catch (e) {
                logger?.log?.(`Was not valid JSON for some reason. Moving on...`);
            }
        }

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
                        logger?.log?.(`Evaluating the inner ${k}: ${v}`);
                        obj[k] = await this.eval(v, [props_obj], logger?.nested?.());
                    } else if (typeof v === "object") {
                        logger?.log?.(`Processing the inner object ${k}`);
                        process(v);
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

        if (this.synthetic) {
            return null;
        }

        // This is the SLOW PATH - we're hitting Hugo WASM because no short-circuit worked
        verboseLog(`[hugo-engine] eval requires Hugo WASM: "${str.substring(0, 80)}${str.length > 80 ? '...' : ''}"`);

        const evalContent = JSON.stringify({ bookshop_eval: true, props: props_obj, full_props: full_props }, null, 2);

        // The result of an expression is a pure function of (expression, props),
        // so it can be cached across live updates — unless the expression can
        // reach data outside its props (site scope, time, other templates).
        const isCacheableExpression = !/\b(site|hugo|now|time|partial|partialCached|resources|getJSON|getCSV)\b|\.Site\b/.test(str);
        const useCache = isCacheableExpression && !(typeof window !== 'undefined' && window.bookshopLiveNoMemo);
        const cacheKey = `${this.dataGeneration}\0${str}\0${evalContent}`;
        if (useCache && this.evalCache.has(cacheKey)) {
            verboseLog(`[hugo-engine] eval cache hit`);
            const cached = this.evalCache.get(cacheKey);
            // Refresh recency so hot expressions survive LRU eviction
            this.evalCache.delete(cacheKey);
            this.evalCache.set(cacheKey, cached);
            // Parsing anew on each hit hands every caller a fresh object,
            // as callers mutate the scopes these results end up in.
            return JSON.parse(cached);
        }

        // Evals run through a partial behind the unified layout, rather than
        // a layout file of their own. Writing layouts/index.html here would
        // shadow layouts/all.html for the home page and permanently break
        // batch rendering. Repeated evals of the same expression skip the
        // template write so Hugo doesn't take the template-changed path.
        const writeFiles = {
            "content/_index.md": evalContent,
            ...ensureUnifiedLayoutInstalled()
        };
        if (this.lastEvalTemplate !== eval_str) {
            writeFiles["layouts/partials/bookshop_eval_expr.html"] = eval_str;
            this.lastEvalTemplate = eval_str;
        }
        await this.wasm.writeFiles(JSON.stringify(writeFiles));

        const { error: buildError } = await this.buildWasm();
        if (buildError) {
            console.warn(buildError);
            return;
        }

        const output = (await this.wasm.readFiles(JSON.stringify([
            "public/index.html"
        ])))["public/index.html"];

        try {
            const result = JSON.parse(output);
            if (useCache) {
                this.evalCache.set(cacheKey, output);
                if (this.evalCache.size > 512) {
                    this.evalCache.delete(this.evalCache.keys().next().value);
                }
            }
            return result;
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
