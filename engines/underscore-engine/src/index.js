const _ = require("underscore");

const underscoreEngine = {
  render: (component, props) => {
    return _.template(`<%= JST["${component}"](props) %>`)({props: props});
  }
}

var JSTHandler = {
  get: (o, name) => {
    let request = new XMLHttpRequest();
    let cpath = name.split('/');
    let cname = cpath[cpath.length - 1];
    request.open('GET', `/components/${name}/${cname}.jst.ejs`, false);  // `false` makes the request synchronous
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

window.ADDSTATES = (classname, states) => {
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