const ejs = require("./ejs");
console.log('hello');

const engine = {
  render: (name, props, options) => {
    let request = new XMLHttpRequest();
    let cpath = name.split('/');
    let cname = cpath[cpath.length - 1];
    request.open('GET', `/components/${name}/${cname}.ejs`, false);  // `false` makes the request synchronous
    request.send(null);
    options.renderRoot.innerHTML = ejs.render(request.responseText, { props });
  }
}

module.exports = {
    ejsEngine: engine
}