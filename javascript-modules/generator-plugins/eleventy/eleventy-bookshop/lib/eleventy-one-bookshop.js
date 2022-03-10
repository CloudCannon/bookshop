const LiquidJS = require("liquidjs");
const path = require("path");
const fs = require("fs");
const normalizePath = require("normalize-path");

const { Tokenizer } = LiquidJS;

const getComponentKey = (name) => {
    const base = name.split("/").reverse()[0];
    return `components/${name}/${base}.eleventy.liquid`;
}

const getIncludeKey = (name) => {
    return `shared/eleventy/${name}.eleventy.liquid`;
}

// TODO: Use forloop.name once 11ty uses liquidjs >=9.28.0
const contextHunt = (ctx, hash, index) => {
    let h = JSON.stringify(hash);
    for (let [k, v] of Object.entries(ctx.getAll())) {
        if (!Array.isArray(v)) continue;
        if (JSON.stringify(v[index]) === h) {
            return k;
        }
    }
    return "UNKNOWN";
}

module.exports = (tagType, locations, baseLocation, bookshopConfig) => (liquidEngine) => {
    return {
        parse: function (tagToken, remainingTokens) {
            const [, component, args] = tagToken.args.match(/^['"]?([^\s'"]+)['"]?(?:[\r\n\s]+([\s\S]*))?$/);
            this.component = component;
            this.args = args ?? "";
        },
        render: async function (ctx) {
            let { component } = this;
            let preComment = `<!--bookshop-live -->`, loop_context = '';
            const postComment = `<!--bookshop-live end-->`;
            // Handle a dynamic component syntax that matches Jekyll:
            // {% bookshop {{component._name}} %}
            if (/^{{.*}}$/.test(component)) {
                component = component.replace(/^{{(.*)}}$/, "$1").trim();
                const dynComponent = await this.liquid.evalValue(component || "", ctx);
                component = dynComponent || this.component;
            }
            const componentKey = tagType === 'include' ?
                getIncludeKey(component) :
                getComponentKey(component);

            let convertedBookshopTag = null;
            for (let location of locations) {
                const bookshopPath = path.join(baseLocation, location);
                const componentPath = path.join(bookshopPath, componentKey);
                if (fs.existsSync(componentPath)) {
                    // TODO: Currently using absolute paths until https://github.com/11ty/eleventy/issues/2090 resolves
                    // const includeRoot = liquidEngine?.options?.root?.filter(p => p.includes('_includes'))?.[0] || "_includes";
                    // const includePath = path.join(baseLocation, includeRoot);
                    // const relativeBookshopPath = path.relative(includePath, bookshopPath);
                    // const relativeIncludePath = path.join(relativeBookshopPath, componentKey);

                    //            11ty 1.x
                    //            (ljs 9.x)
                    const stack = ctx.scopes;
                    const top_context = stack[stack.length - 1] || {};
                    let loop_context = '';
                    if (top_context["forloop"]) {
                        const variable = Object.keys(top_context).filter(k => k !== 'forloop')[0];

                        // TODO: Find the actual source. This is a guess.
                        const index = top_context["forloop"].index0();
                        const guessedSource = contextHunt(ctx, top_context[variable], index);
                        loop_context = `${variable}: ${guessedSource}[${index}]`;
                    }

                    preComment = `<!--bookshop-live name(${component}) params(${this.args}) context(${loop_context}) -->`;
                    convertedBookshopTag = `{% include '${normalizePath(componentPath)}' ${this.args} %}`;
                    break;
                }
            };

            if (!convertedBookshopTag) {
                console.error(`Bookshop: Could not find component ${component} in any of [ ${locations.join(',')} ]`);
                process.exit(1);
            }

            let componentScope = {
                __bookshop__nested: true
            };
            // Support the bookshop bind property
            const tokenizer = new Tokenizer(this.args, {})
            for (const hash of tokenizer.readHashes()) {
                if (hash.name.content === 'bind') {
                    const boundObject = await this.liquid.evalValue(hash?.value?.getText() || "", ctx);
                    componentScope = { ...componentScope, ...boundObject };
                }
            }
            ctx.push(componentScope);
            //                                                                     TODO: this is dirty
            //                                                                     v v v v v v
            const output = await liquidEngine.parseAndRender(convertedBookshopTag, ctx.getAll());

            ctx.pop();

            let metaComment = "";
            if (!ctx.getAll()["__bookshop__nested"]) {
                metaComment = `<!--bookshop-live meta(${bookshopConfig.pathPrefix ? `pathPrefix: "${bookshopConfig.pathPrefix}"` : ''}) -->\n`;
            }
            return `${metaComment}${preComment}${output}${postComment}`;
        }
    };
}