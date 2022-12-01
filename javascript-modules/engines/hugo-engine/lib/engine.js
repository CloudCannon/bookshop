import hugoWasm from "../full-hugo-renderer/hugo_renderer.wasm";
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
        // When this script is run locally, the hugo wasm is loaded as binary rather than output as a file.
        if (hugoWasm?.constructor === Uint8Array) {
            await this.initializeInlineHugo();
        } else {
            await this.initializeLocalCompressedHugo();
        }

        // TODO: Tidy
        const mappedFiles = {};
        for (const file of Object.entries(this.files)) {
            mappedFiles[`layouts/partials/bookshop/${file[0]}`] = translateTextTemplate(file[1], {});
        }

        const success = window.writeHugoFiles(JSON.stringify(mappedFiles));
        window["writeHugoFiles"](
            JSON.stringify({
                "layouts/partials/bookshop.html": `{{/*
    Renders a Bookshop component

    Expects a slice:
    [
        <string>, # Component name
        <_>       # Component props
    ]

    Or a struct:
    {
        _bookshop_name: <string>, # Component name
        ...,                      # Component props
    }

    Or a <string>: # Component name
*/}}

{{- $component_name := false -}}
{{- $component_props := false -}}

{{- if reflect.IsSlice . -}}
    {{- if eq (len .) 2 -}}
        {{- if eq (printf "%T" (index . 0)) "string" -}}
            {{- $component_name = index . 0 -}}
            {{- $component_props = index . 1 -}}
        {{- else -}}
            {{- $err := printf "Expected the first argument to be a string of the component name. Received %+v" (index . 0) -}}
            {{- partial "_bookshop/errors/bad_bookshop_tag" $err -}}
        {{- end -}}
    {{- else -}}
        {{- $err := printf "Expected a slice of length 2, was given %d" (len .) -}}
        {{- partial "_bookshop/errors/bad_bookshop_tag" $err -}}
    {{- end -}}
{{- else if reflect.IsMap . -}}
    {{- if isset . "_bookshop_name" -}}
        {{- $component_name = ._bookshop_name -}}
        {{- $component_props = . -}}
    {{- else -}}
        {{- $err := printf "Expected the provided map to contain a _bookshop_name key. Was given %+v" . -}}
        {{- partial "_bookshop/errors/bad_bookshop_tag" $err -}}
    {{- end -}}
{{- else if eq (printf "%T" .) "string" -}}
    {{- $component_name = . -}}
    {{- $component_props = true -}}
{{- else if . -}}
    {{- $err := printf "Expected a map, slice, or string. Was given the %T: %+v" . . -}}
    {{- partial "_bookshop/errors/bad_bookshop_tag" $err -}}
{{- else -}}
    {{- $err := printf "Expected a map, slice, or string. Was provided with no arguments" -}}
    {{- partial "_bookshop/errors/bad_bookshop_tag" $err -}}
{{- end -}}

{{- if and $component_name $component_props -}}
    {{- partial "_bookshop/helpers/component" (slice $component_name $component_props) -}}
{{- end -}}`,
                "layouts/partials/_bookshop/errors/err.html": `{{/*
    It is what it says on the box.
*/}}

{{ errorf "📚 Error from Bookshop:\\n📚❕ %s" . }}
{{ return true }}`,
                "layouts/partials/_bookshop/errors/bad_bookshop_tag.html": `{{/*
    Prints examples of correct usage of the bookshop tag options

    Expects a String containing a helpful error message.
*/}}

{{- $err := slice 
    .
    "    The following Bookshop tag formats are valid:"
    ""
    "  ► Render a \\"button\\" component with data:"
    " ┌─"
    " │  {{ partial \\"bookshop\\" (slice \\"button\\" (dict \\"text\\" .button.text)) }}"
    " ├─"
    " │  {{ with (dict \\"text\\" .button.text) }}"
    " │     {{ partial \\"bookshop\\" (slice \\"button\\" .) }}"
    " │  {{ end }}"
    " └─"
    ""
    "  ► Render a component from a struct, where the struct contains a _bookshop_name key:"
    " ┌─"
    " │  {{ partial \\"bookshop\\" (dict \\"_bookshop_name\\" \\"button\\" \\"text\\" .button.text) }}"
    " ├─"
    " │  {{ partial \\"bookshop\\" .Params.component_structure }}"
    " └─"
    ""
    "  ► Render a \\"logo\\" component with no data:"
    " ┌─"
    " │  {{ partial \\"bookshop\\" \\"logo\\" }}"
    " └─"
    ""
    "  ► Render a \\"tag\\" partial with data:"
    " ┌─"
    " │  {{ partial \\"bookshop_partial\\" (slice \\"tag\\" (dict \\"message\\" \\"Hello World\\")) }}"
    " └─"
    " "
-}}
{{- partial "_bookshop/errors/err" (delimit $err "\\n") -}}
`,
                "layouts/partials/_bookshop/helpers/component_key.html": `{{/*
    Converts a bare Bookshop component key to a Bookshop path
    i.e. "a/b" --> "bookshop/components/a/b/b.hugo.html"

    Expects a String.
*/}}

{{ $component_fragments := split . "/" }}
{{ $component_fragments = append (last 1 $component_fragments) $component_fragments }}
{{ $component_path := (printf "bookshop/components/%s.hugo.html" (delimit $component_fragments "/")) }}
{{ return $component_path }}`,
                "layouts/partials/_bookshop/helpers/component.html": `{{/*
    Renders a single Bookshop component, 
    wrapping in in a live editing context tag.

    Expects a slice:
    [
        <string>, # Component name
        <_>       # Component props
    ]
*/}}

{{- $component_name := index . 0 -}}
{{- $component_props := index . 1 -}}
{{- $component_path := partial "_bookshop/helpers/component_key" $component_name -}}

{{- if templates.Exists ( printf "partials/%s" $component_path ) -}}

{{ (printf "<!--bookshop-live name(%s)-->" $component_name) | safeHTML }}
{{ partial $component_path $component_props }}
{{ "<!--bookshop-live end-->" | safeHTML }}

{{- else -}}
    {{- $file_loc := slicestr $component_path 9 -}}
    {{- partial "_bookshop/errors/err" (printf "Component \\"%s\\" does not exist.\\n     Create this component by placing a file in your bookshop at %s" $component_name $file_loc) -}}
{{- end -}}
`,
            })
        );
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

    // transformData(data) {
    //     return {
    //         Params: data
    //     };
    // }

    async storeMeta(meta = {}) {
        return
        while (!window.loadHugoBookshopMeta) {
            await sleep(100);
        };
        //TODO: Write these as files
        window.loadHugoBookshopMeta(JSON.stringify(meta));
    }

    async storeInfo(info = {}) {
        return
        while (!window.loadHugoBookshopData) {
            await sleep(100);
        };
        //TODO: Write these as files
        window.loadHugoBookshopData(JSON.stringify(info));
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

    async eval(str, props = [{}]) {
        while (!window.buildHugo) await sleep(10);
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
        window.writeHugoFiles(JSON.stringify({
            "layouts/index.html": eval_str,
            "content/_index.md": JSON.stringify(props_obj, null, 2)
        }));
        window.buildHugo();

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
