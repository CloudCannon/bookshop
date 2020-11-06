var { Liquid, Tokenizer } = require("liquidjs");
var path = require("path");

//root here refers to the path im the browser, not on the fs.
const engine = new Liquid({
  root: "/components", // root for layouts/includes lookup
  extname: ".html", // used for layouts/includes, defaults ""
});
engine.plugin(require("./plugins/bem-mods.js"));
engine.plugin(require("./plugins/jsonify.js"));
engine.plugin(require("./plugins/slugify-plugin.js"));
engine.plugin(require("./plugins/svelte.js"));
engine.plugin(require("./plugins/unbind.js"));

const jekyllEngine = {
  name: "jekyll",
  render: (component, props, options) => {
    let cpath = component.split("/");
    let cname = cpath[cpath.length - 1];
    component = `${component}/${cname}.jekyll.html`;
    options.renderRoot.innerHTML = engine.renderFileSync(component, props);
  },
  init: () => {
    return { packageName: "@bookshop/jekyll-engine" };
  },
};

/**
 * Rewrite Jekyll includes to match LiquidJS syntax
 * @param  {Buffer} text File contents of a Jekyll include
 * @param  {String} path File path of an include
 * @return {String}      File context of a LiquidJS include
 */
const rewriteIncludes = function (text, path) {
  if (path && !/\.jekyll\.html$/.test(path)) {
    return text;
  }
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
