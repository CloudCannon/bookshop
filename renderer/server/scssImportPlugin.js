const fastGlob = require('fast-glob');
const fs = require('fs');
const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const fluidvars = require('postcss-fluidvars');
const stretcher = require('stretcher');

const stretcherImporter = function(url, prev, done) {
    
    url = url.replace(/.*\/stretcher/, '');
    let fileContents = "";
    try {
        fileContents = fs.readFileSync(url);
    } catch {
        return {content: `@warn "Loading ${url} failed."`}
    }

    const {output, warnings} = stretcher(fileContents.toString());
    if (warnings.length) {
        for (warning of warnings) {
            console.warn(`⚠️ WARN [${url}]: ${warning}`);
        }
    }

    return {file: url, contents: output}
}

const BookshopScssImport = (options) => ({
    name: 'bookshop-scss-import',
    setup: (build) => {
        build.onResolve({ filter: /^components\.bookshop_scss$/ }, async (args) => {
            if (args.resolveDir === '') {
                return; // Ignore unresolvable paths
            }

            // TODO: remove "styles" — legacy bokshop support.
            const loadFolders = `@(components|bookshop|styles)`;
            const fullPath = path.join(options.bookshopDir, `/${loadFolders}/**/*.scss`);
            return {
                path: fullPath,
                namespace: 'bookshop-import-scss',
                pluginData: {
                    resolveDir: args.resolveDir,
                    bookshopDir: options.bookshopDir,
                    runScssStretcher: options.runScssStretcher
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-scss' }, async (args) => {
            const files = (await fastGlob(args.path, {
                cwd: args.pluginData.resolveDir,
            })).sort((a,b) => {
                // TODO: remove custom styles sort — legacy bokshop support.
                if (/styles\/[^\/]+\.scss$/.test(a)) a = `/Aardvark/${a}`;
                if (/styles\/[^\/]+\.scss$/.test(b)) b = `/Aardvark/${b}`;
                if (a > b) return 1;
                if (a < b) return -1;
                return 0;
            });
            let importers = [], prepend = "";
            // TODO: Remove legacy bookshop support.
            if (args.pluginData.runScssStretcher) {
                importers.push(stretcherImporter);
                prepend = "/stretcher";
            }

            const sassCode = `
        ${files .map((module, index) => `@import '${prepend}${module}'`)
                .join(';')}
      `;
            const compiledSass = sass.renderSync({data: sassCode, importer: importers, quiet: true});
            const cssCode = compiledSass?.css ?? '// Failed to compile';
            const postcssRunner = postcss([fluidvars()]).process(cssCode);
            const postcssCode = postcssRunner.css;
            const postcssWarnings = postcssRunner.warnings();
            postcssWarnings.forEach(warning => {
                console.warn(`⛔️ POSTCSS[${warning.plugin}]: ${warning.text}`);
            });
            return { contents: postcssCode, loader: 'text', resolveDir: args.pluginData.resolveDir, watchFiles: files };
        });
    },
});
module.exports = BookshopScssImport;