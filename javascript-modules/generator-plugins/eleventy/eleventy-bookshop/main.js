const path = require("path");

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
<script src="${this.host}"></script>
<script>
    window.bookshopBrowser = new window.BookshopBrowser({
    globals: []
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
        // TODO: Better way to check 11ty version
        const isEleventyOne = !!eleventyConfig.ignores;
        const bookshopTag = isEleventyOne
            ? require('./lib/eleventy-one-bookshop.js')
            : require('./lib/eleventy-zero-bookshop.js');
        eleventyConfig.bookshopOptions = { locations, baseLocation };
        eleventyConfig.addLiquidTag("bookshop", bookshopTag('component', locations, baseLocation, bookshopConfig));
        eleventyConfig.addLiquidTag("bookshop_include", bookshopTag('include', locations, baseLocation, bookshopConfig));
        eleventyConfig.addLiquidTag("bookshop_browser", browserTagHandler);
    };
}
