let path = require("path");
let toml = require("toml");
let ejs = require("ejs");
let changeCase = require("change-case");

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

/**
 * Turn our TOML shorthand into Storybook CSF (Component Story Format)
 * @param  {String} source TOML file contents
 * @return {String}        JS file contents in Storybook CSF
 */
module.exports = function (source) {
  //todo: report meaningful errors
  let splitLines = source.split("\n"),
    outputLines = [];
  for (line of splitLines) {
    outputLines.push(line);
    if (/^[a-z0-9\s]+=.*?#.+?$/i.test(line)) {
      let comment = line.match(/^([^"]+|[^"]*?"[^"]*?"[^"]*?)#([^#]+)$/i);
      let variableName = line.match(/^\s*?([a-z0-9-_]+)\s?=/i);
      if (!variableName || !comment) continue;

      outputLines.push(`${variableName[1]}--doc = "${comment[2].trim()}"`);
    } else if (/^\s*?\[.*?#.+?$/i.test(line)) {
      let comment = line.match(/^([^"]+|[^"]*?"[^"]*?"[^"]*?)#([^#]+)$/i);
      if (!comment) continue;
      outputLines.push(`--doc = "${comment[2].trim()}"`);
    }
  }
  let rejoinedToml = outputLines.join("\n");

  let data = toml.parse(rejoinedToml);
  delete data.meta;

  const { frameworks, files } = findFrameworkFiles(this);
  const hasMultipleFrameworks = frameworks.length > 1;

  let { component, title, full } = getTitleFromPath(this);

  if (hasMultipleFrameworks) {
    data.defaults = {
      framework: frameworks[0] || "jekyll",
      ...data.defaults,
    };
  }

  const defaultArgTypes = propsToArgTypes(data.defaults);
  if (hasMultipleFrameworks) {
    defaultArgTypes["framework"] = {
      control: {
        type: "inline-radio",
        options: frameworks,
      },
    };
  }

  let defaults = {
    args: JSON.stringify(propsToArgs(data.defaults)),
    argTypes: JSON.stringify(defaultArgTypes),
  };
  delete data.defaults;

  let stories = [];
  for (let [story, props] of Object.entries(data)) {
    stories.push({
      name: changeCase.camelCase(story),
      args: JSON.stringify(propsToArgs(props)),
      argTypes: JSON.stringify(propsToArgTypes(props)),
    });
  }

  const componentKey = changeCase.snakeCase(component);
  let t = ejs.render(buildStoryTemplate(this, files), {
    component,
    componentKey,
    title,
    full,
    defaults,
    stories,
    frameworks,
  });

  this.callback(null, t);
  return;
};

/**
 * Check the webpack FS for what component files exist
 */
const findFrameworkFiles = (context) => {
  const componentFolder = path.dirname(context.resourcePath);
  const componentName = path.basename(context.resourcePath).split(".")[0];

  const files = {};
  context.query.engines.forEach((engineSettings) => {
    const { engine, extension } = engineSettings;
    files[engine.name] = path.resolve(
      componentFolder,
      `${componentName}.${extension}`
    );
  });

  let existFiles = {};

  let fileList = [];

  for (let [framework, filename] of Object.entries(files)) {
    if (context.fs._statStorage.data.has(filename)) {
      fileList.push(framework);
      existFiles[framework] = filename;
    }
  }

  return {
    frameworks: fileList,
    files: existFiles,
  };
};

/**
 * Use the filepath of the TOML file to generate component name & hierarchy
 */
const getTitleFromPath = (context) => {
  let relativePath = path.relative(context.rootContext, context.resourcePath);
  relativePath = relativePath.split(".")[0];

  let component = path.dirname(relativePath).replace("components/", "");

  let segments = relativePath.split("/");
  segments = Array.from(new Set(segments));
  segments = segments.slice(-3);
  let title = segments
    .map((segment) => changeCase.capitalCase(segment))
    .join("/");

  return { title, component, full: relativePath };
};

/**
 * Turn TOML fields into @storybook/controls argTypes
 */
const propsToArgTypes = (props) => {
  if (!props) return {};
  let argTypes = {};
  Object.entries(props).map(([key, val]) => {
    if (/--doc/.test(key)) return;
    let propData = typeFromVal(key, val);
    for (let item of propData) {
      argTypes[item.key] = {
        control: {
          type: item.name,
          options: item.options || null,
        },
        name: item.label || item.key,
        description: findDocForProp(
          item.rawKey || item.key,
          item.rawOptions,
          props
        ),
        defaultValue: "",
      };
    }
  });
  return argTypes;
};

/**
 * Turn TOML fields into @storybook/controls args
 */
const propsToArgs = (props) => {
  if (!props) return {};
  let args = {};
  Object.entries(props).map(([key, val]) => {
    if (/--doc/.test(key)) return;
    let propData = typeFromVal(key, val);
    for (let item of propData) {
      args[item.key] = item.value;
    }
  });
  return args;
};

const typeFromVal = (key, val) => {
  if (typeof val === "undefined") {
    return [
      {
        name: "text",
        value: val,
        key: key,
      },
    ];
  }
  if (typeof val === "string") {
    return determineStringVal(key, val);
  }
  if (typeof val === "boolean") {
    return [
      {
        name: "boolean",
        value: val,
        key: key,
      },
    ];
  }
  if (typeof val === "number") {
    return [
      {
        name: "number",
        value: val,
        key: key,
      },
    ];
  }
  if (Array.isArray(val)) {
    return [
      {
        name: "array",
        value: val,
        key: key,
      },
    ];
  }
  if (Object.keys(val).length) {
    return determineObjectType(key, val);
  }
  return [
    {
      name: "text",
      value: val,
      key: key,
    },
  ];
};

const determineObjectType = (key, val) => {
  let rawKey = key;
  let splitKey = key.split("--"),
    enumType;
  if (splitKey.length == 1) splitKey[1] = "o";

  [key, enumType] = splitKey;

  if (enumType === "preview") enumType = "select";

  if (/^(select|radio|inline-radio)$/.test(enumType)) {
    return [
      {
        name: enumType,
        value: val[Object.keys(val).find((v) => v !== "--doc")],
        options: capitalizeKeys(val),
        rawOptions: val,
        key: key,
        rawKey: rawKey,
      },
    ];
  }

  if (/^(multi-select|check|inline-check)$/.test(enumType)) {
    return [
      {
        name: enumType,
        value: [val[Object.keys(val).find((v) => v !== "--doc")]],
        options: capitalizeKeys(val),
        rawOptions: val,
        key: key,
        rawKey: rawKey,
      },
    ];
  }

  if (enumType == "repeat" || enumType == "o") {
    let repeatControls = [];

    repeatControls.push({
      name: "radio",
      key: `${key}&&object-info-field`,
      rawKey: `${rawKey}&&object-info-field`,
      label: `${key}`,
      options: {},
    });

    for (let [controlKey, controlVal] of Object.entries(val)) {
      if (/--doc/.test(controlKey)) continue;
      let innerKeys = typeFromVal(controlKey, controlVal);
      for (let ik of innerKeys) {
        repeatControls.push({
          ...ik,
          key: `${key}&&${ik["key"]}`,
          rawKey: `${rawKey}&&${ik["key"]}`,
          label: `${enumType == "repeat" ? "🔁" : "↪️"} ${key}${
            enumType == "repeat" ? "[n]" : ""
          }.${ik["key"]}`,
        });
      }
    }
    if (enumType == "repeat") {
      repeatControls.push({
        name: "range",
        value: 3,
        key: `${key}&&repeat-count`,
        rawKey: `${rawKey}&&repeat-count`,
        label: `Number of ${key}`,
      });
    }
    return repeatControls;
  }

  return [
    {
      name: "object",
      value: val,
      key: key,
    },
  ];
};

/**
 * Try and guess what input type the string represents.
 */
const determineStringVal = (key, val) => {
  if (/#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})/i.test(val)) {
    return [
      {
        name: "color",
        value: val,
        key: key,
      },
    ];
  }
  if (val[0] === "{" || val[0] === "[") {
    return [
      {
        name: "object",
        value: val,
        key: key,
      },
    ];
  }
  return [
    {
      name: "text",
      value: val,
      key: key,
    },
  ];
};

/**
 * Capitalize keys in an object.
 * Use this when padding a set of options to storybook,
 * i.e. for a select box. Makes things prettier.
 */
const capitalizeKeys = (o) => {
  let output = {};
  for (let [key, val] of Object.entries(o)) {
    if (/--doc/.test(key)) continue;
    output[changeCase.capitalCase(key)] = val;
  }
  return output;
};

/**
 * When processing the TOML we turn comments into fields.
 * This function finds any of those fields if they exist.
 */
const findDocForProp = (key, options, props) => {
  key = key.replace(`&&object-info-field`, "&&");
  let docVal;

  if (options && Object.keys(options).length) {
    docVal = options[`--doc`];
    if (docVal) {
      return docVal;
    }
  }

  docVal = drillForProp(`${key}--doc`, props);
  if (docVal) {
    return docVal;
  }
  return "";
};

/**
 * Search for a prop deep within an object
 * @param  {String} key   Path to key e.g. "line.text.item"
 * @param  {Object} props Object to search
 */
function drillForProp(key, props) {
  return key.split("&&").reduce(function (prev, curr) {
    return prev ? prev[curr] : null;
  }, props || self);
}
