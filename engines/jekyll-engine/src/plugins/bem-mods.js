/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerFilter('addmods', (classname, ...mods) => {
        let base = classname.split(' ')[0];
        for (let mod of mods) {
            if (mod[1]) {
              classname = classname+" "+base+"--"+mod[0];
            }
        }
        return classname;
    });

    this.registerFilter('addstates', (classname, ...states) => {
        for (let state of states) {
            if (state[1]) {
              classname = classname+" is-"+state[0];
            }
        }
        return classname;
    });
}