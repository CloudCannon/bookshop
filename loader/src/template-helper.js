/**
 * Build the template for the story. This hooks into the configured engines to allow them
 * to perform specific setup.
 * @param context The webpack context
 * @param files The set of file names for each frameworks story
 */
const buildStoryTemplate = (context, files) => {
  const initBlock = context.query.engines
    .map((engineSettings) => {
      const name = engineSettings.engine.name;
      const varName = name.replace("-", "_");
      return engineSettings.engine.init(varName, files[name]);
    })
    .join("\n");

  const renderBlock = context.query.engines
    .map((engineSettings) => {
      const name = engineSettings.engine.name;
      const varName = name.replace("-", "_");
      return `if (props.framework === "${name}") ${varName}.render("<%- component %>", consolidatedProps, options);`;
    })
    .join("\n");

  const optionsBlock = context.query.engines
    .map((engineSettings) => {
      const engine = engineSettings.engine;
      const options = engine.options ? engine.options() : "null";
      return `"${engine.name}":${options},`;
    })
    .join("\n");

  return `
    ${initBlock}

    const component = function(props) {
      if (!props.framework) props.framework = "<%- frameworks[0] %>";
      let uniqueFrameworkKey = this.uniqueKey + "_" + props.framework;
      let newComponentRender = false;

      let bookshopRoot = document.querySelector("#bookshop-generated-render-root");
      if (!bookshopRoot) {
        bookshopRoot = document.createElement('div');
        bookshopRoot.id = "bookshop-generated-render-root";
        document.body.appendChild(bookshopRoot);
      }

      let renderRoot = bookshopRoot.querySelector(\`#\${uniqueFrameworkKey}\`);
      if (!renderRoot) {
        renderRoot = document.createElement('div');
        renderRoot.id = uniqueFrameworkKey;
        bookshopRoot.innerHTML = "";
        bookshopRoot.appendChild(renderRoot);
        newComponentRender = true;
      }

      let consolidatedProps = {};
      for (let [key, val] of Object.entries(props)) {
        let splitKey = key.split('&&');
        if (splitKey.length == 1) {
          consolidatedProps[key] = val;
          continue;
        }
        let [baseKey, innerKey] = splitKey;
        consolidatedProps[baseKey] = consolidatedProps[baseKey] || {};
        if (innerKey === "repeat-count") {
          let baseObj = consolidatedProps[baseKey];
          consolidatedProps[baseKey] = [];
          for (var i = 0; i < val; i++) {
            consolidatedProps[baseKey].push(baseObj);
          }
          continue;
        }
        consolidatedProps[baseKey][innerKey] = val;
      }

      let options = {
        uniqueKey: uniqueFrameworkKey,
        renderRoot: renderRoot,
        newComponentRender: newComponentRender,
        ${optionsBlock}
      }

      ${renderBlock}

      return '<div id="bookshop-rendered-elsewhere"></div>';
    }

    export default {
        title: "<%= title %>",
        args: <%- defaults.args %>,
        argTypes: <%- defaults.argTypes %>,
    };

    <% for(var i=0; i<stories.length; i++) {%>
    export const <%= stories[i].name %> = component.bind({uniqueKey: "bookshop_<%= componentKey %>_<%= stories[i].name %>"});
    <%= stories[i].name %>.args = <%- stories[i].args %>;
    <%= stories[i].name %>.argTypes = <%- stories[i].argTypes %>;
    <% } %>`;
};

module.exports = buildStoryTemplate;
