#! /usr/bin/env node

const {
    program
} = require('commander');
const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');

program
    .requiredOption('-c, --components <dir>', 'component library source')
    .option('-s, --svelte <dir>', 'svelte ', '')
    .option('-o, --output <dir>', 'output directory', '_bookshop')
    .option('-w, --watch', 'watch for changes', false);

program.parse(process.argv);

let outputPath = path.resolve(process.cwd(), program.output);
let libPath = path.resolve(process.cwd(), program.components);
let sveltePath = program.svelte ? path.resolve(process.cwd(), program.svelte) : '';

if (!libPath) {
    outputPath = path.resolve(process.cwd(), 'dist/jekyll');
    libPath = process.cwd();
}

const jekyllExtractRules = [];

// Core file to trigger all file extracts
jekyllExtractRules.push({
    test: /theme-files\.js$/,
    use: [{
        loader: require.resolve('import-glob')
    }, {
        loader: require.resolve('string-replace-loader'),
        options: {
            search: '__ROOT__',
            replace: libPath,
            flags: 'g'
        }
    }],
    include: [
        __dirname,
    ],
    enforce: "pre"
})

// Special case for root CSS file to map to a new location
jekyllExtractRules.push({
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
    }, {
        loader: require.resolve('import-glob')
    }, ],
    include: [
        path.resolve(libPath),
    ],
});

// Outputting scss files to component dirs
jekyllExtractRules.push({
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
    }, {
        loader: require.resolve('import-glob')
    }, ],
    include: [
        path.resolve(libPath, 'components'),
        path.resolve(libPath, 'styles')
    ],
});

// Outputting component HTML to component dirs
jekyllExtractRules.push({
    test: /\.html$/,
    use: [{
        loader: require.resolve('file-loader'),
        options: {
            name: 'components/[path][name].html',
            context: path.resolve(libPath, 'components'),
        }
    }, {
        loader: require.resolve('extract-loader')
    }, {
        loader: require.resolve('raw-loader')
    }],
    include: [
        path.resolve(libPath),
    ],
});

// Move TOML files to component folders for array structures
jekyllExtractRules.push({
    test: /\.toml$/,
    use: [{
        loader: require.resolve('file-loader'),
        options: {
            name: 'components/[path][name].[ext]',
            context: path.resolve(libPath, 'components'),
        }
    }, {
        loader: require.resolve('extract-loader')
    }, {
        loader: require.resolve('raw-loader')
    }],
    include: [
        path.resolve(libPath),
    ],
});

if (sveltePath) {
    // Ignore Svelte files imported by theme-files.js
    jekyllExtractRules.push({
        test: /\.svelte/,
        use: [{
            loader: require.resolve('null-loader')
        }]
    });
} else {
    // Pass Svelte files through if we're not bundling
    jekyllExtractRules.push({
        test: /\.svelte/,
        use: [{
            loader: require.resolve('file-loader'),
            options: {
                name: 'components/[path][name].[ext]',
                context: path.resolve(libPath, 'components'),
            }
        }, {
            loader: require.resolve('extract-loader')
        }, {
            loader: require.resolve('raw-loader')
        }],
        include: [
            path.resolve(libPath),
        ],
    });
}

// Bundle svelte into prebuild JS
if (sveltePath) {
    webpack({
        mode: 'production',
        entry: path.resolve(__dirname, 'svelte.js'),
        output: {
            library: 'bookshop_components',
            libraryTarget: 'umd',
            path: path.dirname(sveltePath),
            filename: path.basename(sveltePath)
        },
        module: {
            rules: [{
                test: /svelte-files\.js$/,
                use: [{
                    loader: require.resolve('import-glob-keyed')
                }, {
                    loader: require.resolve('string-replace-loader'),
                    options: {
                        search: '__ROOT__',
                        replace: libPath,
                        flags: 'g'
                    }
                }],
                include: [
                    __dirname,
                    path.resolve(libPath),
                ],
                enforce: "pre"
            }, {
                test: /\.svelte/,
                exclude: /node_modules/,
                use: [{
                    loader: require.resolve('svelte-loader'),
                    options: {
                        hydratable: true
                    }
                }]
            }, {
                test: /\.html$/i,
                loader: 'html-loader',
            }]
        }
    }, (err, stats) => {
        if (err || stats.hasErrors()) {
            console.log("Error building Svelte");
            console.log(err);
            stats = stats.toJson();
            if (stats.errors) {
                for (let e of stats.errors) {
                    console.log(e);
                }
            }
        }
        console.log("Prebuilt Svelte extracted to " + sveltePath);
    });
}

webpack({
    mode: 'production',
    entry: path.resolve(__dirname, 'theme.js'),
    output: {
        path: outputPath,
        filename: 'assets/js/theme.js'
    },
    module: {
        rules: jekyllExtractRules
    },
    plugins: [
        new CleanWebpackPlugin()
    ],
    watch: program.watch,
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
    if (!sveltePath) console.log("Raw Svelte files passed through to bookshop directory");
});