const underscoreEngine = {
  render: (component, props) => {
    props = JSON.stringify(props);

    return ejs.render(`<%- JST["${component}"](${props}) %>`, {}, {client: true});
  }
}

const JSTHandler = {
  get: (_, name) => {
    let request = new XMLHttpRequest();
    request.open('GET', `/components/${name}.jst.ejs`, false);  // `false` makes the request synchronous
    request.send(null);

    return ejs.compile(request.responseText, {client: true});
  },
};

window.JST = new Proxy({}, JSTHandler);

module.exports = {
    underscoreEngine: underscoreEngine
}