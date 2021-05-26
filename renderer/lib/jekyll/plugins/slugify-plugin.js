var slugify = require('slugify')

/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerFilter('slugify', (text) => {
        if (text && typeof text === 'string') return slugify(text).toLowerCase()
        return text
    });
}