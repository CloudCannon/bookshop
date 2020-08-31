const _ = require("underscore");

const underscoreEngine = {
  render: (component, props) => {
    return _.template(`<%= JST["${component}"](props) %>`)({props: props});
  }
}

var JSTHandler = {
  get: (o, name) => {
    let request = new XMLHttpRequest();
    request.open('GET', `/components/${name}.jst.ejs`, false);  // `false` makes the request synchronous
    request.send(null);
    return _.template(request.responseText);
  },
};

window.JST = new Proxy({}, JSTHandler);

window.ADDMODS = (classname, mods) => {
    let base = classname;
    for (let [mod, val] of Object.entries(mods)) {
        if (val) {
            classname = `${classname} ${base}--${mod}`;
        }
    }
    return classname;
}

module.exports = {
    underscoreEngine: underscoreEngine
}