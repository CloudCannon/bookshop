const path = require("path");
const fs = require("fs");

const getComponentKey = (name) => {
    const base = name.split("/").reverse()[0];
    return `components/${name}/${base}.eleventy.liquid`;
}

const getIncludeKey = (name) => {
    return `shared/eleventy/${name}.eleventy.liquid`;
}

const contextHunt = (ctx, hash, index) => {
    let h = JSON.stringify(hash);
    for (let scope of ctx.contexts.reverse()) {
        for (let [k, v] of Object.entries(scope)) {
            if (!Array.isArray(v)) continue;
            if (JSON.stringify(v[index]) === h) {
                return k;
            }
        }
    }
    return "UNKNOWN";
}

module.exports = (tagType, locations, baseLocation) => (liquidEngine) => {
    return {
        parse: function (tagToken, remainingTokens) {
            const [, component, args] = tagToken.args.match(/^['"]?([^\s'"]+)['"]?(?:[\r\n\s]+([\s\S]*))?$/);
            this.component = component;
            this.args = args ?? "";
        },
        render: async function (ctx, hash) {
            let component = this.component;
            let preComment = `<!--bookshop-live -->`, loop_context = '';
            const postComment = `<!--bookshop-live end-->`;
            // Handle a dynamic component syntax that matches Jekyll:
            // {% bookshop {{component._name}} %}
            if (/^{{.*}}$/.test(component)) {
                component = component.replace(/^{{(.*)}}$/, "$1").trim();
                component = ctx.get(component) || this.component;
            }
            const componentKey = tagType === 'include' ?
                getIncludeKey(component) :
                getComponentKey(component);

            let convertedBookshopTag = null;
            for (let location of locations) {
                const bookshopPath = path.join(baseLocation, location);
                const componentPath = path.join(bookshopPath, componentKey);
                if (fs.existsSync(componentPath)) {
                    const includeRoot = liquidEngine?.options?.root?.filter(p => p.includes('_includes'))?.[0] || "_includes";
                    const includePath = path.join(baseLocation, includeRoot);
                    const relativeBookshopPath = path.relative(includePath, bookshopPath);
                    const relativeIncludePath = path.join(relativeBookshopPath, componentKey);

                    //            11ty 0.x
                    //            (ljs 6.x)
                    const stack = ctx.contexts;

                    const top_context = stack[stack.length - 1] || {};
                    let loop_context = '';
                    if (top_context["forloop"]) {
                        const variable = Object.keys(top_context).filter(k => k !== 'forloop')[0];

                        // TODO: Find the actual source. This is a guess.
                        const index = top_context["forloop"].index0;
                        const guessedSource = contextHunt(ctx, top_context[variable], index);
                        loop_context = `${variable}: ${guessedSource}[${index}]`;
                    }

                    preComment = `<!--bookshop-live name(${component}) params(${this.args}) context(${loop_context}) -->`;
                    convertedBookshopTag = `{% include ${relativeIncludePath} ${this.args} %}`;
                    break;
                }
            };

            if (!convertedBookshopTag) {
                console.error(`Bookshop: Could not find component ${component} in any of [ ${locations.join(',')} ]`);
                process.exit(1);
            }

            // Support the bookshop bind property
            const componentScope = { ...(hash.bind || {}) };
            ctx.push(componentScope);

            const tpl = liquidEngine.parse(convertedBookshopTag); // 11ty 0.x (ljs 6.x)
            const output = await tpl[0].render(ctx);              // 11ty 0.x (ljs 6.x)

            // Parameter required for 11ty 0.x (ljs 6.x)
            // 11ty 1.x (ljs 9.x) would be fine with ctx.pop();
            ctx.pop(componentScope);
            return `${preComment}${output}${postComment}`;
        }
    };
}