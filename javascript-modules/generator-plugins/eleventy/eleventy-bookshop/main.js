const path = require("path");
const fs = require("fs");

const getComponentKey = (name) => {
    const base = name.split("/").reverse()[0];
    return `components/${name}/${base}.eleventy.liquid`;
}

const bookshopTagHandler = (locations, baseLocation) => (liquidEngine) => {
    return {
        parse: function (tagToken, remainingTokens) {
            const [, component, args] = tagToken.args.match(/^['"]?([^\s'"]+)['"]?\s(.*)$/);
            this.component = component;
            this.args = args;
        },
        render: async function (ctx, hash) {
            let component = this.component;
            // Handle a dynamic component syntax that matches Jekyll:
            // {% bookshop {{component._name}} %}
            if (/^{{.*}}$/.test(component)) {
                component = component.replace(/^{{(.*)}}$/, "$1").trim();
                component = ctx.get(component) || this.component;
            }
            const componentKey = getComponentKey(component);
            let bookshopTagAsInclude = null;

            for (let location of locations) {
                const componentPath = path.join(baseLocation, location, componentKey);
                if (fs.existsSync(componentPath)) {
                    // TODO: Parse this based on the configured _includes dir
                    const relativeIncludePath = path.join('../', location, componentKey);
                    bookshopTagAsInclude = `{% include ${relativeIncludePath} ${this.args} %}`;
                    break;
                }
            };

            if (!bookshopTagAsInclude) {
                console.error(`Bookshop: Could not find component ${component} in any of [ ${locations.join(',')} ]`);
                process.exit(1);
            }

            // Support the bookshop bind property
            ctx.push({...(hash.bind || {})});
            const tpl = liquidEngine.parse(bookshopTagAsInclude);
            const output = await tpl[0].render(ctx);
            ctx.pop();
            return output;
        }
    };
}

module.exports = (bookshopConfig) => {
    const locations = bookshopConfig.bookshopLocations || [];
    // This should be the path of the site .eleventy.js
    const baseLocation = path.dirname(module.parent.filename);
    return function (eleventyConfig) {
        eleventyConfig.bookshopOptions = { locations, baseLocation };
        eleventyConfig.addLiquidTag("bookshop", bookshopTagHandler(locations, baseLocation));
    };
}