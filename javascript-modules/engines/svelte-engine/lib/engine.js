
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

        // Hide our files somewhere global so that
        // the sveltekit plugin can grab them instead of using its Vite import.
        window.__bookshop_svelte_files = options.files;

        this.activeApps = [];
    }

    getShared(name) {
        const key = `shared/svelte/${name}.svelte`
        return this.files?.[key];
    }

    getComponentKey(name) {
        const base = name.split("/").reverse()[0];
        return `components/${name}/${base}.svelte`;
    }

    getFlatComponentKey(name) {
        return `components/${name}.svelte`;
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

    async render(target, name, props, globals) {
        if (!globals || typeof globals !== "object") globals = {};
        props = { ...globals, ...props };

        const matchingApps = this.activeApps
            .filter(app => app.app?.$$?.root === target && app.name === name);
        if (matchingApps.length) {
            matchingApps.forEach(app => {
                this.update(app.app, props);
            });
            return this.clean();
        }

        let source = this.getComponent(name);
        if (!source) {
            console.warn(`[svelte-engine] No component found for ${name}`);
            return this.clean();
        }
        this.activeApps.push({
            name,
            app: new source({ target, props })
        });
        this.clean();
    }

    update(app, props) {
        app.$$set?.(props);
    }

    destroy(target, name) {
        for (let i = this.activeApps.length - 1; i >= 0; i--) {
            const app = this.activeApps[i];
            if (app.app.$$?.root === target && (!name || app.name === name)) {
                app.app.$destroy();
                this.activeApps.splice(i, 1);
            }
        }
    }

    clean() {
        for (let i = this.activeApps.length - 1; i >= 0; i--) {
            const app = this.activeApps[i];
            if (app.app.$$?.root?.parentNode === null) {
                app.app.$destroy();
                this.activeApps.splice(i, 1);
            }
        }
    }
}
