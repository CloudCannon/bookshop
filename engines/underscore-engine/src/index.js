const _ = require("underscore");

const underscoreEngine = {
  name: "jst-ejs",
  render: (component, props, options) => {
    let name = component;
    let request = new XMLHttpRequest();
    let cpath = name.split("/");
    let cname = cpath[cpath.length - 1];
    request.open("GET", `/components/${name}/${cname}.jst.ejs`, false); // `false` makes the request synchronous
    request.send(null);
    options.renderRoot.innerHTML = _.template(request.responseText)({
      ...props,
      ADDMODS: (classname, mods) => {
        let base = classname.split(" ")[0];
        for (let [mod, val] of Object.entries(mods)) {
          if (val) {
            classname = `${classname} ${base}--${mod}`;
          }
        }
        return classname;
      },
      ADDSTATES: (states) => {
        let classname = "";
        for (let [state, val] of Object.entries(states)) {
          if (val) {
            classname = `${classname} is-${state}`;
          }
        }
        return classname;
      },
    });
  },
  init: () => {
    return {
      packageName: "@bookshop/underscore-engine",
    };
  },
};

module.exports = {
  engine: underscoreEngine,
};
