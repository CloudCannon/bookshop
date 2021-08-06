import { Liquid } from 'liquidjs';
import translateLiquid from './translateLiquid.js';

/**
 * LiquidJS plugins
 */
import jsonify from './plugins/jsonify.js';
import slugify from './plugins/slugify-plugin.js';
import svelte from './plugins/svelte.js';
import unbind from './plugins/unbind.js';
import emulateJekyll from './plugins/emulate-jekyll.js';
import local from './plugins/local.js';
import highlight from './plugins/highlight.js';

export class Engine {
    constructor(options) {
        options = {
            name: "Jekyll",
            files: {},
            ...options,
        };

        this.key = 'jekyll';
        this.name = options.name;
        this.files = options.files;
        this.plugins = options.plugins || [];
        this.plugins.push(jsonify, slugify, svelte, unbind, emulateJekyll, local, highlight);

        this.initializeLiquid();
        this.applyLiquidPlugins();
    }

    initializeLiquid() {
        const je = this;
        this.liquid = new Liquid({
            fs: {
                readFileSync (file) {
                    return "LiquidJS readFileSync unimplemented"
                },
                async readFile (file) {
                    return await je.retrieveInclude(file);
                },
                existsSync () {
                    return true
                },
                async exists () {
                    return true
                },
                resolve(root, file, ext) {
                    return file
                }
            }
        });
    }

    async retrieveInclude(file) {
        let content;
        if (/^_bookshop_include_/.test(file)) {
            content = this.getShared(file.replace(/^_bookshop_include_/, ""));
        } else if (/^_bookshop_/.test(file)) {
            content = this.getComponent(file.replace(/^_bookshop_/, ""));
        } else {
            content = this.files?.[file];
        }
        if (!content && content !== "") {
            console.warn(`[jekyll-engine] No file found for ${file}`);
            return "";
        }
        return translateLiquid(content, {isInclude: true});
    }

    applyLiquidPlugins() {
        this.plugins.forEach(plugin => {
            this.liquid.plugin(plugin);
        });
    }

    getShared(name) {
        const key = `shared/jekyll/${name}.jekyll.html`
        return this.files?.[key];
    }

    getComponentKey(name) {
        return `components/${name}/${name}.jekyll.html`;
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
            console.warn(`[jekyll-engine] No component found for ${name}`);
            return "";
        }
        source = translateLiquid(source, {});
        if (!globals || typeof globals !== "object") globals = {};
        props = { ...globals, include: props };
        target.innerHTML = await this.liquid.parseAndRender(source || "", props);
    }

    loader() {
        // esbuild loader if required
    }
}
