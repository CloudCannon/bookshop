const { Liquid } = require('liquidjs');
const translateLiquid = require('./lib/translateLiquid');

/**
 * LiquidJS plugins
 */
const jsonify = require('./plugins/jsonify.js');
const slugify = require('./plugins/slugify-plugin.js');
const svelte = require('./plugins/svelte.js');
const unbind = require('./plugins/unbind.js');
const emulateJekyll = require('./plugins/emulate-jekyll.js');
const local = require('./plugins/local.js');
const highlight = require('./plugins/highlight.js');

class JekyllEngine {
    constructor(options) {
        options = {
            extension: ".jekyll.html",
            name: "Jekyll",
            files: {},
            ...options,
        };

        this.extension = options.extension;
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

module.exports = JekyllEngine;
