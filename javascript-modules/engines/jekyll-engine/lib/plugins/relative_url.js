export default (meta) => function (Liquid) {
    this.registerFilter('relative_url', (url) => {
        url = url || "";

        // Intentionally less-accurate than Jekyll implementation. Works in most cases.
        if (url.startsWith('/') && !url.startsWith('//')) {
            const baseurl = meta.baseurl || '';
            return `${baseurl}${url}`.replace(/\/\//g, '/');
        }
        return url;
    });
}
