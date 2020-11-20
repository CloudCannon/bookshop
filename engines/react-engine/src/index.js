const React = require("react");
const ReactDOM = require("react-dom");

const reactEngine = {
  name: "react",
  packageName: "@bookshop/react-engine",
  render: (component, props, options, context, fileName) => {
    ReactDOM.render(
      React.createElement(context[component].default, props, null),
      options.renderRoot
    );
  },
};

module.exports = {
  engine: reactEngine,
};
