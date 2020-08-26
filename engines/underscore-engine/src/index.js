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

module.exports = {
    underscoreEngine: underscoreEngine
}