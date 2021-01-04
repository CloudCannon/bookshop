const ejs = require("./ejs");

function fetchComponent(path) {
  let request = new XMLHttpRequest();
  request.open("GET", `/${path}`, false); // `false` makes the request synchronous
  request.send(null);
  return request.responseText;
}

const engine = {
  render: (name, props, options) => {
    options.renderRoot.innerHTML = ejs.render(
      `<% include = window.include %>${fetchComponent(
        `components/${name}/${name}.ejs`
      )}`,
      { props }
    );
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
window.include = (path, props) => {
  const parts = path.split("/");
  const lastPart = parts[parts.length - 1].replace(".ejs", "");

  const ejsComponent = fetchComponent(
    `${path.replace(".ejs", "").toLowerCase()}/${lastPart}.ejs`
  );
  return ejs.render(ejsComponent, { props });
};

module.exports = {
  ejsEngine: engine,
};
