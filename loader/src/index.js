let path = require("path");
let toml = require("toml");
let ejs = require("ejs");
let changeCase = require("change-case");
let buildStoryTemplate = require("./template-helper");
let { propsToArgs, propsToArgTypes } = require("./props-helper");

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
      framework: frameworks[0] || "none",
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
