const fastGlob = require('fast-glob');
const fs = require('fs');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const fluidvars = require('postcss-fluidvars');

const BookshopScssImport = (options) => ({
    name: 'bookshop-scss-import',
    setup: (build) => {
        build.onResolve({ filter: /^components\.bookshop_scss$/ }, async (args) => {
            if (args.resolveDir === '') {
                return; // Ignore unresolvable paths
            }

            const loadFolders = `@(components|bookshop)`;
            const fullPaths = options.bookshopDirs.map(d => path.join(d, `/${loadFolders}/**/*.scss`));
            return {
                path: 'bookshop',
                namespace: 'bookshop-import-scss',
                pluginData: {
                    resolveDir: args.resolveDir,
                    fullPaths: fullPaths,
                    fluidns: options.fluidns
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-scss' }, async (args) => {
            const files = (await fastGlob(args.pluginData.fullPaths, {
                cwd: args.pluginData.resolveDir,
            })).sort();

            try {
                let importers = [], prepend = "";

                const sassCode = `
            ${files .map((module, index) => `@import '${prepend}${module}'`)
                    .join(';')}
        `;
                const compiledSass = sass.renderSync({data: sassCode, importer: importers, quiet: true});
                const cssCode = compiledSass?.css ?? '// Failed to compile';
                const fluidns = args.pluginData.fluidns || '';
                const postcssRunner = postcss([fluidvars({namespace: fluidns})]).process(cssCode);
                const postcssCode = postcssRunner.css;
                const postcssWarnings = postcssRunner.warnings();
                postcssWarnings.forEach(warning => {
                    console.warn(`⛔️ POSTCSS[${warning.plugin}]: ${warning.text}`);
                });
                return { contents: postcssCode, loader: 'text', resolveDir: args.pluginData.resolveDir, watchFiles: files };
            } catch (e) {
                console.error("Bookshop sass compilation failed:");
                console.error(e.formatted);
                return { contents: `.bookshop-renderer::after {
                    content: "⛔️      Bookshop sass rendering failed     ⛔️";
                    text-align: center;
                    white-space: pre;
                    color: white;
                    position: absolute;
                    left: 0;
                    bottom: 0;
                    width: 100%;
                    padding: 10px;
                    background-color: #960000;
                }`, loader: 'text', resolveDir: args.pluginData.resolveDir, watchFiles: files };
            }
        });
    },
});
module.exports = BookshopScssImport;