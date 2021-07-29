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
        const content = this.files?.[file] || "";
        return translateLiquid(content, {isInclude: true});
    }

    applyLiquidPlugins() {
        this.plugins.forEach(plugin => {
            this.liquid.plugin(plugin);
        });
    }

    async render(source, props, globals) {
        source = translateLiquid(source, {});
        if (!globals || typeof globals !== "object") globals = {};
        props = { ...globals, include: props };
        return await this.liquid.parseAndRender(source || "", props);
    }

    loader() {
        // esbuild loader if required
    }
}
