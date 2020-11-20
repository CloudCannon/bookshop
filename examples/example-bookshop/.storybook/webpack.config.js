const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const createCompiler = require("@storybook/addon-docs/mdx-compiler-plugin");
const { rewriteIncludes } = require("@bookshop/jekyll-engine");
const svelteEngine = require("@bookshop/svelte-engine").engine;
const jekyllEngine = require("@bookshop/jekyll-engine").engine;
const reactEngine = require("@bookshop/react-engine").engine;
const underscoreEngine = require("@bookshop/underscore-engine").engine;
const projectRoot = path.resolve(__dirname, "../");

module.exports = async ({ config, mode }) => {
  config.module.rules.push({
    test: /\.stories\.to?ml?$/,
    use: [
      {
        loader: "@bookshop/loader",
        options: {
          mdxCompiler: createCompiler({}),
          engines: [
            { engine: svelteEngine, extension: "svelte" },
            { engine: jekyllEngine, extension: "jekyll.html" },
            //{ engine: underscoreEngine, extension: "jst.ejs" },
            { engine: reactEngine, extension: "jsx" },
          ],
        },
      },
    ],
  });

  config.module.rules.push({
    test: /\.scss$/,
    use: [
      "style-loader",
      {
        loader: "css-loader",
        options: {
          sourceMap: false,
        },
      },
      {
        loader: "resolve-url-loader",
        options: {
          debug: false,
          root: projectRoot,
        },
      },
      {
        loader: "sass-loader",
        options: {
          implementation: require("node-sass"),
          sassOptions: {
            importer: require("stretcher-importer"),
          },
        },
      },
      "import-glob",
      "stretcher-loader",
    ],
    include: [projectRoot],
  });

  config.module.rules.push({
    test: /\.svelte$/,
    use: ["svelte-loader"],
    include: [projectRoot],
  });

  config.module.rules.push({
    test: /\.jsx$/,
    use: {
      loader: "babel-loader",
      options: {
        presets: ["@babel/preset-react"],
      },
    },
  });

  config.plugins.push(
    new CopyPlugin({
      patterns: [
        //{
        //from: path.resolve(projectRoot, "components/**/*"),
        //context: path.resolve(projectRoot, "components"),
        //to: "./components",
        //globOptions: {
        //ignore: ["*.stories.*"],
        //},
        //transform(content, path) {
        //return rewriteIncludes(content, path);
        //},
        //},
        {
          from: path.resolve(projectRoot, "assets"),
          to: "./assets",
          globOptions: {
            ignore: ["*.scss"],
          },
        },
      ],
    })
  );

  return config;
};
