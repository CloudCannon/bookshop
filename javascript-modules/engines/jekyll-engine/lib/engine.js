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
import markdownify from './plugins/markdownify.js';
import emulateJekyll from './plugins/emulate-jekyll.js';
import local from './plugins/local.js';
import relativeUrlFilterBuilder from './plugins/relative_url.js';


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
        this.plugins.push(jsonify, slugify, unbind, emulateJekyll, local, liquidHighlight, loop_context, markdownify);

        this.meta = {};
        this.info = {};
        this.plugins.push(relativeUrlFilterBuilder(this.meta));

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

    transformData(data) {
        let keys = Object.keys(data);
        if (keys && keys.length === 1 && keys[0] === 'page') {
            // This likely came from an older version of cloudcannon-jekyll-bookshop
            return data;
        }
        return {
            page: data
        };
    }

    injectInfo(props) {
        for (const collection of Object.values(this.info.collections || {})) {
            for (const item of (collection || [])) {
                item.content = "Content is not available when live editing";
            }
        }
        return {
            site: {
                ...(this.info.collections || {}),
                data: (this.info.data || {}),
                baseurl: this.meta.baseurl || "",
                title: this.meta.title || "",
            },
            ...props,
            env_bookshop_live: true,
        };
    }

    async storeMeta(meta = {}) {
        this.meta.baseurl = meta.baseurl ? await this.eval(meta.baseurl) : undefined;
        this.meta.title = meta.title ? await this.eval(meta.title) : undefined;
    }

    async storeInfo(info = {}) {
        this.info = info;
    }

    async render(target, name, props, globals, logger) {
        let source = this.getComponent(name);
        // TODO: Remove the below check and update the live comments to denote shared
        if (!source) source = this.getShared(name);
        if (!source) {
            console.warn(`[jekyll-engine] No component found for ${name}`);
            return "";
        }
        logger?.log?.(`Going to render ${name}, with source:`);
        logger?.log?.(source);
        source = translateLiquid(source, {});
        logger?.log?.(`Rewritten the template for ${name} to:`);
        logger?.log?.(source);
        if (!globals || typeof globals !== "object") globals = {};
        props = this.injectInfo({ ...globals, include: props });
        target.innerHTML = await this.liquid.parseAndRender(source || "", props);
        logger?.log?.(`Rendered ${name} as:`);
        logger?.log?.(target.innerHTML);
    }

    async eval(str, props = [{}]) {
        try {
            // Template values might have been parenthesised for parsing, 
            // so we remove outer parentheses.
            if (/^\([\s\S]+\)$/.test(str)) {
                str = str.replace(/^\(|\)$/g, '');
            }
            str = str.replace(/\n/g, ''); // TODO: Are there any cases where this breaks the eval?
            const ctx = new Context();
            ctx.push(this.injectInfo({}));
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
            console.warn(`Error evaluating \`${str}\` in the Jekyll engine`, e.toString());
            return '';
        }
    }

    loader() {
        // esbuild loader if required
    }
}
