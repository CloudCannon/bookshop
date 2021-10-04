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
            const postComment = `<!--bookshop end-->`;
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
                const componentPath = path.join(baseLocation, location, componentKey);
                if (fs.existsSync(componentPath)) {
                    // TODO: Parse this based on the configured _includes dir
                    const relativeIncludePath = path.join('../', location, componentKey);

                    let loop_context = '';
                    const top_context = ctx.contexts[ctx.contexts.length - 1] || {};
                    if (top_context["forloop"]) {
                        const variable = Object.keys(top_context).filter(k => k !== 'forloop')[0];
                        const source = 'UNKNOWN';
                        const index = top_context["forloop"].index - 1;
                        loop_context = `${variable}: ${source}[${index}]`;
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
            ctx.push({...(hash.bind || {})});
            const tpl = liquidEngine.parse(convertedBookshopTag);
            const output = await tpl[0].render(ctx);
            ctx.pop();
            return `${preComment}${output}${postComment}`;
        }
    };
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