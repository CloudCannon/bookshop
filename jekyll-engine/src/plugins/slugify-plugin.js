var slugify = require('slugify')

/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerFilter('slugify', (text) => {
        return slugify(text).toLowerCase()
    });
}