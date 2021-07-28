/**
 * Implementation of Jekyll's jsonify filter
 */
module.exports = function (Liquid) {
    this.registerFilter('jsonify', (classname) => {
        return JSON.stringify(classname);
    });
}