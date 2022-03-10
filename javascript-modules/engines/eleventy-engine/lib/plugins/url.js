export default (meta) => function (Liquid) {
    this.registerFilter('url', (url) => {
        url = url || "";

        // Intentionally less-accurate than 11ty implementation. Works in most cases.
        if (url.startsWith('/') && !url.startsWith('//')) {
            if (meta.pathPrefix === undefined || typeof meta.pathPrefix !== "string") {
                // When you retrieve this with config.getFilter("url") it
                // grabs the pathPrefix argument from your config for you.
                console.error([
                    `The Eleventy Bookshop plugin needs to be supplied a pathPrefix in order to use the url filter.`,
                    `e.g. in .eleventy.js:`,
                    ``,
                    `eleventyConfig.addPlugin(pluginBookshop({`,
                    `    bookshopLocations: <. . .>,`,
                    `    pathPrefix: "/documentation/"`,
                    `  }));`,
                ].join('\n'))
                throw new Error("pathPrefix (String) is required in the `url` filter. This should be supplied ");
            }

            const baseurl = meta.pathPrefix || '';
            return `${baseurl}${url}`.replace(/\/\//g, '/');
        }
        return url;
    });
}
