const path = require("path");
const fs = require("fs");

const getComponentKey = (name) => {
    const base = name.split("/").reverse()[0];
    return `components/${name}/${base}.eleventy.liquid`;
}

const getIncludeKey = (name) => {
    return `shared/eleventy/${name}.eleventy.liquid`;
}

const bookshopTagHandler = (tagType, locations, baseLocation) => (liquidEngine) => {
    return {
        parse: function (tagToken, remainingTokens) {
            const [, component, args] = tagToken.args.match(/^['"]?([^\s'"]+)['"]?\s(.*)$/);
            this.component = component;
            this.args = args;
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

                    let loop_context = '';
                    const top_context = ctx.contexts[ctx.contexts.length - 1] || {};
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
            const componentScope = {...(hash.bind || {})};
            ctx.push(componentScope);
            const tpl = liquidEngine.parse(convertedBookshopTag);
            const output = await tpl[0].render(ctx);

            // TODO: This is for old liquidjs. 
            // We shouldn't need to pass the scope in any more.
            ctx.pop(componentScope);
            return `${preComment}${output}${postComment}`;
        }
    };
}

const contextHunt = (ctx, hash, index) => {
    let h = JSON.stringify(hash);
    for (let scope of ctx.contexts.reverse()) {
        for (let [k,v] of Object.entries(scope)) {
            if (!Array.isArray(v)) continue;
            if (JSON.stringify(v[index]) === h) {
                return k;
            }
        }
    }
    return "UNKNOWN";
}

const transformHostString = (host) => {
    switch (host) {
        case host.match(/^:\d+$/)?.input:
            return `http://localhost${host}/bookshop.js`;
        case host.match(/^\d+$/)?.input:
            return `http://localhost:${host}/bookshop.js`;
        case host.match(/^localhost:\d+$/)?.input:
            return `http://${host}/bookshop.js`;
        case host.match(/^\/|https?:\/\//)?.input:
            return host;
        default:
            return `//${host}`;
    }
}

const browserTagHandler = (liquidEngine) => {
    return {
        parse: function (tagToken, remainingTokens) {
            const host = tagToken.args.trim();
            this.host = transformHostString(host);
        },
        render: async function (ctx, hash) {
            return `
<div data-bookshop-browser></div>
<script>window.bookshop_browser_site_data = null;</script>
<script src="${this.host}"></script>
<script>
    window.bookshopBrowser = new window.BookshopBrowser({
    globals: [window.bookshop_browser_site_data]
    }); 
    window.bookshopBrowser.render();
</script>`;
        }
    };
}

module.exports = (bookshopConfig) => {
    const locations = bookshopConfig.bookshopLocations || [];
    // This should be the path of the site .eleventy.js
    const baseLocation = path.dirname(module.parent.filename);
    return function (eleventyConfig) {
        eleventyConfig.bookshopOptions = { locations, baseLocation };
        eleventyConfig.addLiquidTag("bookshop", bookshopTagHandler('component', locations, baseLocation));
        eleventyConfig.addLiquidTag("bookshop_include", bookshopTagHandler('include', locations, baseLocation));
        eleventyConfig.addLiquidTag("bookshop_browser", browserTagHandler);
    };
}
