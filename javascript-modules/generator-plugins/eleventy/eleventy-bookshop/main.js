const path = require("path");

const browserTagHandler = (liquidEngine) => {
    return {
        parse: function (tagToken, remainingTokens) {
            this.host = tagToken.args.trim();
        },
        render: async function (ctx, hash) {
            console.error(`The {% bookshop_browser ${this.host} %} tag has been replaced in Bookshop 3.0`);
            console.error(`Replace this tag with {% bookshop_component_browser %}`);
            console.error(`Note: The port argument is no longer needed, nor are any environment checks`);
            process.exit(1);
        }
    };
}

const componentBrowserTagHandler = (liquidEngine) => {
    return {
        parse: function (tagToken, remainingTokens) {
            let port = tagToken.args.trim();
            if (port.length) {
                const is_int = /^\d+$/.test(port);
                if (!is_int) {
                    console.error(`bookshop_component_browser expected either no argument, or an integer for the local port number used when running @bookshop/browser.`);
                    process.exit(1);
                }
            } else {
                port = 30775;
            }
            this.port = port;
        },
        render: async function (ctx, hash) {
            return `<div data-bookshop-browser=""></div>
<script src="http://localhost:${this.port}/bookshop.js"></script>
<script>
    window.bookshopBrowser = new window.BookshopBrowser({globals: []});
    window.bookshopBrowser.render();
</script>`;
        }
    };
}

module.exports = (bookshopConfig = {}) => {
    const locations = bookshopConfig.bookshopLocations || [];
    const baseLocation = 
      typeof bookshopConfig.baseLocation === 'string' 
        ? bookshopConfig.baseLocation 
        : typeof module?.parent?.filename === 'string' 
          // This should be the path of the site .eleventy.js
          ? path.dirname(module.parent.filename) 
          : process.cwd();
    
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
        eleventyConfig.addLiquidTag("bookshop_component_browser", componentBrowserTagHandler);
    };
}
