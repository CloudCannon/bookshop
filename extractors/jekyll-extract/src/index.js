#! /usr/bin/env node

const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

let outputPath = path.resolve(process.cwd(), '_bookshop');
let libPath = path.resolve(process.cwd(), process.env.COMPONENT_LIB);

if (!libPath) {
    outputPath = path.resolve(process.cwd(), 'dist/jekyll');
    libPath = process.cwd();
}

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
                        replace: libPath,
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
                        name: 'sass/bookshop.scss',
                    }
                }, {
                    loader: require.resolve('extract-loader')
                }, {
                    loader: require.resolve('raw-loader')
                },
                require.resolve('import-glob')
            ],
            include: [
                path.resolve(libPath),
            ],
        }, {
            test: /\.scss$/,
            use: [{
                    loader: require.resolve('file-loader'),
                    options: {
                        name: 'sass/[path][name].[ext]',
                        context: path.resolve(libPath),
                    }
                }, {
                    loader: require.resolve('extract-loader')
                }, {
                    loader: require.resolve('raw-loader')
                },
                require.resolve('import-glob')
            ],
            include: [
                path.resolve(libPath, 'components'),
                path.resolve(libPath, 'styles')
            ],
        }, {
            test: /\.html$/,
            use: [{
                loader: require.resolve('file-loader'),
                options: {
                    name: 'components/[name].html',
                }
            }, {
                loader: require.resolve('extract-loader')
            }, {
                loader: require.resolve('raw-loader')
            }],
            include: [
                path.resolve(libPath),
            ],
        }]
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    watch: true,
    watchOptions: {
        aggregateTimeout: 500,
        ignored: ['.git/**', 'node_modules/**', 'dist/**']
    }
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