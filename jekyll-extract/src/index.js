#! /usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

const outputPath = path.resolve(process.cwd(), 'dist/jekyll');

webpack({
    mode: 'production',
    entry: path.resolve(__dirname, 'theme.js'),
    output: {
        path: outputPath,
        filename: 'assets/js/theme.js'
    },
    module: {
        rules: [{
            test: /\.js$/,
            use: [
                require.resolve('import-glob'), {
                    loader: require.resolve('string-replace-loader'),
                    options: {
                        search: '__ROOT__',
                        replace: process.cwd(),
                        flags: 'g'
                    }
                }
            ],
            include: [
                __dirname,
            ],
            enforce: "pre"
        }, {
            test: /root\.scss$/,
            use: [{
                    loader: require.resolve('file-loader'),
                    options: {
                        name: '_sass/theme.scss',
                    }
                }, {
                    loader: require.resolve('extract-loader')
                }, {
                    loader: require.resolve('raw-loader')
                },
                require.resolve('import-glob')
            ],
            include: [
                process.cwd(),
            ],
        }, {
            test: /\.scss$/,
            use: [{
                    loader: require.resolve('file-loader'),
                    options: {
                        name: '_sass/[path][name].[ext]',
                    }
                }, {
                    loader: require.resolve('extract-loader')
                }, {
                    loader: require.resolve('raw-loader')
                },
                require.resolve('import-glob')
            ],
            include: [
                path.resolve(process.cwd(), 'components'),
                path.resolve(process.cwd(), 'styles')
            ],
        }, {
            test: /\.html$/,
            use: [{
                loader: require.resolve('file-loader'),
                options: {
                    name: '_includes/[path][name].html',
                }
            }, {
                loader: require.resolve('extract-loader')
            }, {
                loader: require.resolve('raw-loader')
            }],
            include: [
                process.cwd(),
            ],
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyPlugin({
            patterns: [{
                from: path.resolve(process.cwd(), 'temporary-jekyll-data'),
                to: outputPath
            }]
        })
    ]
}, (err, stats) => {
    if (err || stats.hasErrors()) {
        console.log("Error extracting theme");
        console.log(err);
        stats = stats.toJson();
        if (stats.errors) {
            for (let e of stats.errors) {
                console.log(e);
            }
        }
    }
    console.log("Theme extracted to " + outputPath);
});