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
            const fullPath = path.join(options.bookshopDir, `components/**/*${fileTypes}`);
            return {
                path: fullPath,
                namespace: 'bookshop-import-glob',
                pluginData: {
                    resolveDir: args.resolveDir,
                    bookshopDir: options.bookshopDir
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-glob' }, async (args) => {
            const files = (await fastGlob(args.path, {
                cwd: args.pluginData.resolveDir,
            })).sort();
            let importerCode = `
        ${files
                .map((module, index) => `import module${index} from '${module}'`)
                .join(';')}

        const modules = {${files
                .map((module, index) => `"${module.replace(args.pluginData.bookshopDir, "")}": module${index}`)
                .join(',')}};

        export default modules
      `;
            return { contents: importerCode, resolveDir: args.pluginData.resolveDir };
        });
    },
});
module.exports = BookshopImportGlob;