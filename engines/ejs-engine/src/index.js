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
  	// Handle that the full path is not provided (just component-name, e.g, component("button"))
	const modifiedPathParts = path.split('/');
	const lastPart = modifiedPathParts[modifiedPathParts.length - 1];
  const newPath = `${path.replace('.ejs', '')}/${lastPart}.ejs`;
  
  const ejsComponent = fetchComponent(
    `components/${newPath.toLowerCase()}`
  );

  // include tag is necessary for a new component that imports a legacy component
  return ejs.render(`<% include = window.include %>${ejsComponent}`, { props });
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
  return ejs.render(`<% include = window.include%>${ejsComponent}`, { props });
};

module.exports = {
  ejsEngine: engine,
};
