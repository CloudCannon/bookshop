var { Liquid, Tokenizer } = require("liquidjs");
const bem = require("./plugins/bem-mods.js");
const jsonify = require("./plugins/jsonify.js");
const slugify = require("./plugins/slugify-plugin.js");
const svelte = require("./plugins/svelte.js");
const unbind = require("./plugins/unbind.js");

const jekyllEngine = {
  name: "jekyll",
  packageName: "@bookshop/jekyll-engine",
  render: (component, props, options, context) => {
    options.renderRoot.innerHTML = createEngine(context).renderFileSync(
      component,
      props
    );
  },
};

const createEngine = (context) => {
  const engine = new Liquid({
    fs: createFs(context),
  });
  engine.plugin(bem);
  engine.plugin(jsonify);
  engine.plugin(slugify);
  engine.plugin(svelte);
  engine.plugin(unbind);
  return engine;
};

const createFs = (context) => {
  return {
    readFileSync: (file) => {
      return rewriteIncludes(context[file]);
    },
    readFile: async (file) => {
      return rewriteIncludes(context[file]);
    },
    existsSync: (file) => {
      return !!context[file];
    },
    exists: async (file) => {
      return !!context[file];
    },
    resolve: (root, file, ext) => {
      if (context[file]) {
        return file;
      } else {
        return Object.keys(context).filter((key) => key.includes(file))[0];
      }
    },
  };
};

/**
 * Rewrite Jekyll includes to match LiquidJS syntax
 * @param  {Buffer} text File contents of a Jekyll include
 * @param  {String} path File path of an include
 * @return {String}      File context of a LiquidJS include
 */
const rewriteIncludes = function (text) {
  text = text.toString();
  let tokenizer = new Tokenizer(text);
  let output = tokenizer.readTopLevelTokens();

  output.reverse().forEach((tag) => {
    text = rewriteTag(tag, text);
  });

  return `{% unbind %}${text}`;
};

const rewriteTag = function (token, src) {
  let raw = token.getText();
  let length = raw.length;

  if (token.kind === 16) return src; // html
  if (token.name && token.name.match(/^end/)) return src;

  if (token.name && token.name === "include_cached")
    raw = raw.replace(/include_cached/, "include");
  if (token.name && token.name === "component") {
    token.name = "include";
    raw = raw.replace(/component (\S+)/, (_, component) => {
      let cpath = component.split("/");
      let cname = cpath[cpath.length - 1];
      return `include ${component}/${cname}.jekyll.html`;
    });
  }
  if (token.name && token.name.match(/^include/)) {
    raw = raw.replace(/=/g, ": ");
    raw = raw.replace(/include\s([^"'][^\s]+)/gi, 'include "$1"');
  }

  raw = raw.replace(/\binclude\./gi, "");

  return [src.substr(0, token.begin), raw, src.substr(token.end)].join("");
};

module.exports = {
  engine: jekyllEngine,
  rewriteIncludes: rewriteIncludes,
};
