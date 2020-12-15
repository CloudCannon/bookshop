const path = require("path");

module.exports = {
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "index.js",
    libraryTarget: "commonjs2",
  },

  mode: "development",
  target: "web",

  // Enable sourcemaps for debugging webpack's output.
  devtool: "source-map",

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".jsx"],
    fallback: { path: require.resolve("path-browserify"), fs: false },
  },

  module: {
    rules: [
      {
        test: /(\.ts(x?))|(\.jsx?)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
    ],
  },
  // externals: {
  //   'react': 'react', // Case matters here
  //   'react-dom' : 'react-dom' // Case matters here
  // },
  // externals: [
  //   {
  //     fs: "empty",
  //   },
  // ],
  plugins: [],
};
