import { Liquid, Context } from 'liquidjs';
import translateLiquid from './translateLiquid.js';

/**
 * LiquidJS plugins
 */
import { liquidHighlight } from '@bookshop/helpers';

import jsonify from './plugins/jsonify.js';
import slugify from './plugins/slugify-plugin.js';
import unbind from './plugins/unbind.js';
import loop_context from './plugins/loop_context.js';
import emulateJekyll from './plugins/emulate-jekyll.js';
import local from './plugins/local.js';


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
        this.plugins.push(jsonify, slugify, unbind, emulateJekyll, local, liquidHighlight, loop_context);

        this.initializeLiquid();
        this.applyLiquidPlugins();
    }

    initializeLiquid() {
        const je = this;
        this.liquid = new Liquid({
            fs: {
                readFileSync(file) {
                    return "LiquidJS readFileSync unimplemented"
                },
                async readFile(file) {
                    return await je.retrieveInclude(file);
                },
                existsSync() {
                    return true
                },
                async exists() {
                    return true
                },
                resolve(root, file, ext) {
                    return `${root}${file}`
                }
            }
        });
    }

    async retrieveInclude(file) {
        let content;
        if (/_bookshop_include_/.test(file)) {
            content = this.getShared(file.replace(/^.*_bookshop_include_/, ""));
        } else if (/_bookshop_/.test(file)) {
            content = this.getComponent(file.replace(/^.*_bookshop_/, ""));
        } else {
            content = this.files?.[file];
        }
        if (!content && content !== "") {
            console.warn(`[jekyll-engine] No file found for ${file}`);
            return "";
        }
        return translateLiquid(content, { isInclude: true });
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
        const base = name.split("/").reverse()[0];
        return `components/${name}/${base}.jekyll.html`;
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

    async render(target, name, props, globals) {
        let source = this.getComponent(name);
        // TODO: Remove the below check and update the live comments to denote shared
        if (!source) source = this.getShared(name);
        if (!source) {
            console.warn(`[jekyll-engine] No component found for ${name}`);
            return "";
        }
        source = translateLiquid(source, {});
        if (!globals || typeof globals !== "object") globals = {};
        props = { ...globals, include: props };
        target.innerHTML = await this.liquid.parseAndRender(source || "", props);
    }

    async eval(str, props = [{}]) {
        try {
            const ctx = new Context();
            if (Array.isArray(props)) {
                props.forEach(p => ctx.push(p));
            } else {
                ctx.push(props);
            }
            const [, value, index] = str.match(/^(.*?)(?:\[(\d+)\])?$/);
            let result = await this.liquid.evalValue(value, ctx);
            if (index && typeof result === 'object' && !Array.isArray(result)) {
                result = Object.entries(result);
            }
            return index ? result?.[index] : result;
        } catch (e) {
            console.error(`Error evaluating ${str}`, e);
            return '';
        }
    }

    loader() {
        // esbuild loader if required
    }
}
