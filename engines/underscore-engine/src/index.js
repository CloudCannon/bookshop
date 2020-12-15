const _ = require("underscore");
const ejs = require("ejs");

const underscoreEngine = {
  render: (name, props, options) => {
    let request = new XMLHttpRequest();
    let cpath = name.split('/');
    let cname = cpath[cpath.length - 1];
    request.open('GET', `/components/${name}/${cname}.ejs`, false);  // `false` makes the request synchronous
    request.send(null);
    options.renderRoot.innerHTML = ejs.render(request.responseText);
  }
}

var JSTHandler = {
  get: (o, name) => {
    let request = new XMLHttpRequest();
    let cpath = name.split('/');
    let cname = cpath[cpath.length - 1];
    request.open('GET', `/components/${name}/${cname}.ejs`, false);  // `false` makes the request synchronous
    request.send(null);
    return _.template(request.responseText);
  },
};

window.JST = new Proxy({}, JSTHandler);

window.ADDMODS = (classname, mods) => {
    let base = classname.split(' ')[0];
    for (let [mod, val] of Object.entries(mods)) {
        if (val) {
            classname = `${classname} ${base}--${mod}`;
        }
    }
    return classname;
}

window.ADDSTATES = (states) => {
    let classname = '';
    for (let [state, val] of Object.entries(states)) {
        if (val) {
            classname = `${classname} is-${state}`;
        }
    }
    return classname;
}

module.exports = {
    underscoreEngine: underscoreEngine
}