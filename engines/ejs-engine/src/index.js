const ejs = require("./ejs");

function fetchComponent(path) {
  let request = new XMLHttpRequest();
  request.open("GET", `/${path}`, false); // `false` makes the request synchronous
  request.send(null);
  return request.responseText;
}

const engine = {
  render: (name, props, options) => {
    const nameParts = name.split("/");
    const lastPart = nameParts[nameParts.length - 1];
    options.renderRoot.innerHTML = ejs.render(
      `<% include = window.include %>${fetchComponent(
        `components/${name}/${lastPart}.ejs`
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
    `${path.toLowerCase()}`
    // path.replace('Components', 'components')
  );
  return ejs.render(ejsComponent, { props });
};

module.exports = {
  ejsEngine: engine,
};
