/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerFilter('addmods', (classname, ...mods) => {
        let base = classname;
        console.log(mods);
        for (let mod of mods) {
            if (mod[1]) {
              classname = classname+" "+base+"--"+mod[0];
            }
        }
        return classname;
    });
}