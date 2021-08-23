
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
        this.activeApps = {};
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
        if (!globals || typeof globals !== "object") globals = {};
        props = { ...globals, ...props };

        if (this.activeApps[target]?.name === name) {
            return this.update(target, props);
        }

        let source = this.getComponent(name);
        if (!source) {
            console.warn(`[svelte-engine] No component found for ${name}`);
            return "";
        }
        this.activeApps[target] = {
            name,
            app: new source({target, props})
        };
    }

    update(target, props) {
        if (!this.activeApps[target]?.app) return;
        this.activeApps[target].app?.$$set?.(props);
    }

    destroy(target, name) {
        if (!name || this.activeApps[target]?.name === name) {
            this.activeApps[target].app?.$destroy?.();
        }
        delete this.activeApps[target];
    }
}
