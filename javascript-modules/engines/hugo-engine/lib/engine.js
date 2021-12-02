import wasmywasmy from "../hugo-renderer/hugo_renderer.wasm";

const sleep = (ms = 0) => {
    return new Promise(r => setTimeout(r, ms));
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
        const wasmOrigin = scriptOrigin.replace(/\/[^\.\/]+\.js$/, wasmywasmy.replace(/^\./, ''));
        console.log(`Loading ${wasmOrigin}`);
        const go = new Go();
        const response = await fetch(wasmOrigin);
        const buffer = await response.arrayBuffer();
        const result = await WebAssembly.instantiate(buffer, go.importObject);
        go.run(result.instance)
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

    async render(target, name, props, globals) {
        while (!window.renderHugo) await sleep(100);

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
        try {
            return `TODO:${str}`;
            // const ctx = new Context();
            // if (Array.isArray(props)) {
            //     props.forEach(p => ctx.push(p));
            // } else {
            //     ctx.push(props);
            // }
            // const [, value, index] = str.match(/^(.*?)(?:\[(\d+)\])?$/);
            // let result = await this.liquid.evalValue(value, ctx);
            // if (index && typeof result === 'object' && !Array.isArray(result)) {
            //     result = Object.entries(result);
            // }
            // return index ? result[index] : result;
        } catch (e) {
            console.error(`Error evaluating ${str}`, e);
            return '';
        }
    }

    loader() {
        // esbuild loader if required
    }
}
