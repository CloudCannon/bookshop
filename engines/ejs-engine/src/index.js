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
      // Include override (legacy)
      `<% include = window.include%>${fetchComponent(
        `components/${name}/${lastPart}.ejs`
      )}`,
      { props }
    );
  },
};

/**
 *
 * Storybook handling for including other components
 *
 * @param {string} filename
 * @param {Record<string, any>} props
 *
 * @return {string} EJS component string
 */
window.component = (path, props) => {
  const ejsComponent = fetchComponent(
    `components/${path.toLowerCase()}`
  );
  return ejs.render(ejsComponent, { props });
};

/**
 *
 * Legacy syntax support
 *
 * @deprecated
 * @param {string} filename
 * @param {Record<string, any>} props
 *
 * @return {string} EJS component string
 */
window.include = (path, props) => {
  const ejsComponent = fetchComponent(
    `${path.toLowerCase()}`
  );
  return ejs.render(ejsComponent, { props });
};

module.exports = {
  ejsEngine: engine,
};
