const fastGlob = require('fast-glob');
const path = require('path');

const BookshopImportGlob = (options) => ({
    name: 'bookshop-import',
    setup: (build) => {
        build.onResolve({ filter: /^components$/ }, async (args) => {
            if (args.resolveDir === '') {
                return; // Ignore unresolvable paths
            }
            const fileTypes = `@(${options.fileTypes.join("|")})`;
            const fullPaths = options.bookshopDirs.map(d => path.join(d, `components/**/*${fileTypes}`));
            return {
                path: 'bookshop',
                namespace: 'bookshop-import-glob',
                pluginData: {
                    resolveDir: args.resolveDir,
                    fullPaths: fullPaths,
                    bookshopDirs: options.bookshopDirs
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-glob' }, async (args) => {
            const files = (await fastGlob(args.pluginData.fullPaths, {
                cwd: args.pluginData.resolveDir,
            })).sort();
            const sanitizePath = (inputPath) => {
                args.pluginData.bookshopDirs.forEach(bookshopDir => {
                    inputPath = inputPath.replace(bookshopDir, "")
                });
                return inputPath;
            };
            const importerCode = `
        ${files
                .map((module, index) => `import module${index} from '${module}'`)
                .join(';')}

        const modules = {${files
                .map((module, index) => `"${sanitizePath(module)}": module${index}`)
                .join(',')}};

        export default modules
      `;
            return { contents: importerCode, resolveDir: args.pluginData.resolveDir };
        });
    },
});
module.exports = BookshopImportGlob;