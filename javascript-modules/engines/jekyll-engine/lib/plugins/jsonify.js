/**
 * Implementation of Jekyll's jsonify filter
 */
 export default function (Liquid) {
    this.registerFilter('jsonify', (classname) => {
        return JSON.stringify(classname);
    });
}