import hugoWasm from "../hugo-renderer/hugo_renderer.wasm";

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

        this.initializeHugo();
    }

    async initializeHugo() {
        const scriptOrigin = document.currentScript?.src || `/bookshop.js`;
        const wasmOrigin = scriptOrigin.replace(/\/[^\.\/]+\.js$/, hugoWasm.replace(/^\./, ''));
        const go = new Go();
        const response = await fetch(wasmOrigin);
        const buffer = await response.arrayBuffer();
        const result = await WebAssembly.instantiate(buffer, go.importObject);
        go.run(result.instance)

        // TODO: Tidy
        const mappedFiles = {};
        for (const file of Object.entries(this.files)) {
            mappedFiles[file[0]] = {
                contents: file[1]
            }
        }

        const success = window.loadHugoBookshopPartials(JSON.stringify(mappedFiles));
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

    async render(target, name, props, globals) {
        while (!window.renderHugo) await sleep(10);

        let source = this.getComponent(name);
        // TODO: Remove the below check and update the live comments to denote shared
        if (!source) source = this.getShared(name);
        if (!source) {
            console.warn(`[hugo-engine] No component found for ${name}`);
            return "";
        }
        if (!globals || typeof globals !== "object") globals = {};
        props = { ...globals, ...props };
        const output = window.renderHugo(source, JSON.stringify(props));
        target.innerHTML = output;
    }

    async eval(str, props = [{}]) {
        if (/^(false|true)$/.test(str)) {
            return str === "true";
        }
        if (/^\d+$/.test(str)) {
            return parseInt(str);
        }
        if (/^(\".+\"|\'.+\')/.test(str)) {
            return str.replace(/^.|.$/g, '');
        }
        if (!/^\.Params(\.\S+)*$/.test(str)) {
            console.error([
                `Bookshop Hugo: Couldn't evaluate \`${str}\`.`,
                `For Bookshop bindings, only \`.Params.*\` are supported.`,
                `Arrays can be indexed into using dot notation: \`.Params.some_array.4\``,
                `Raw values can be passed: true,false,"string",1234`,
            ].join(' '));
            return '';
        }
        try {
            for (let prop_object of props) {
                const val = dig(prop_object, str.replace(/^\./, ''));
                if (val) return val;
            }
            return null;
        } catch (e) {
            console.error(`Error evaluating ${str}`, e.toString());
            return null;
        }
    }

    loader() {
        // esbuild loader if required
    }
}
