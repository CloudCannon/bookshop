
export class Engine {
    constructor(options) {
        options = {
            name: "Svelte",
            files: {},
            ...options,
        };

        this.key = 'svelte';
        this.name = options.name;
        this.files = options.files;
    }

    getShared(name) {
        const key = `shared/svelte/${name}.svelte`
        return this.files?.[key];
    }

    getComponentKey(name) {
        return `components/${name}/${name}.svelte`;
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
        let source = this.getComponent(name);
        if (!source) {
            console.warn(`[svelte-engine] No component found for ${name}`);
            return "";
        }
        if (!globals || typeof globals !== "object") globals = {};
        props = { ...globals, ...props };
        new source({target, props});
    }
}
