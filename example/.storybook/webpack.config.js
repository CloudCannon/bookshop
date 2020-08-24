const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const { rewriteIncludes } = require('@bookshop/jekyll-engine');

const projectRoot = path.resolve(__dirname, '../');

module.exports = async({
    config,
    mode
}) => {
    config.module.rules.push({
        test: /\.stories\.to?ml?$/,
        use: [
            '@bookshop/loader'
        ]
    });

    config.module.rules.push({
        test: /\.scss$/,
        use: [
            'style-loader', {
                loader: 'css-loader',
                options: {
                    sourceMap: false
                }
            }, {
                loader: 'resolve-url-loader',
                options: {
                    debug: false,
                    root: projectRoot,
                }
            }, {
                loader: 'sass-loader',
                options: {
                    implementation: require("sass"),
                    sourceMap: false
                }
            },
            'import-glob'
        ],
        include: [
            projectRoot,
        ],
    });

      config.plugins.push(
        new CopyPlugin({
            patterns: [{
            from: path.resolve(projectRoot, 'components/**/*.jekyll.html'),
            to: './components',
            globOptions: {
                ignore: ['*.stories.*'],
            },
            transform(content, path) {
              return rewriteIncludes(content);
            },
            flatten: true
          }]
        }));

    return config;
};