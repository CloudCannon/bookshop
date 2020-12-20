const ejs = require("./ejs");

function fetchComponent(name) {
  let request = new XMLHttpRequest();
  let cpath = name.split("/");
  let cname = cpath[cpath.length - 1];
  request.open("GET", `/components/${name}/${cname}.ejs`, false); // `false` makes the request synchronous
  request.send(null);
  return request.responseText;
}

const engine = {
  render: (name, props, options) => {
    options.renderRoot.innerHTML = ejs.render(`<% include = window.include %>${fetchComponent(name)}`, { props });
  },
};

/**
 *
 * Storybook handling for `include`
 *
 * @param {string} filename
 * @param {Record<string, any>} props
 *
 * @return {string} EJS component string
 */
window.include = (filename, props) => {
  // https://stackoverflow.com/questions/1661197/what-characters-are-valid-for-javascript-variable-names
  const componentName = filename
    .match(/([a-zA-Z_$][0-9a-zA-Z_$]*)\.ejs/g)[0]
    .replace(".ejs", "");
  const ejsComponent = fetchComponent(componentName);
  return ejs.render(ejsComponent, props);
};

module.exports = {
  ejsEngine: engine,
};
