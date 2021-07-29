import path from 'path';
import fastGlob from 'fast-glob';

const importFile = (file, index) => {
    return `
    import file${index} from '__bookshop_file__${file}';
    files['${file}'] = file${index};`
}

export default (options) => ({
    name: 'bookshop-glob',
    setup: (build) => {
        build.onResolve({ filter: /^__bookshop_glob__/ }, async (args) => {
            const primaryBookshopDir = options?.bookshopDirs?.[0];
            if (!primaryBookshopDir) return;
            return {
                path: args.path.replace(/^__bookshop_glob__/, ''),
                namespace: 'bookshop-import-glob',
                pluginData: {
                    resolveDir: path.join(primaryBookshopDir)
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-glob' }, async (args) => {
            const files = (await fastGlob(`components/**/*@${args.path}`, {
                cwd: args.pluginData.resolveDir,
            })).sort();
            // const sanitizePath = (inputPath) => {
            //     args.pluginData.bookshopDirs.forEach(bookshopDir => {
            //         inputPath = inputPath.replace(bookshopDir, "")
            //     });
            //     return inputPath;
            // };
            const output = `
            const files = {};
            ${files.map(importFile).join('\n')}

            export default files;
            `;
            return { contents: output, resolveDir: args.pluginData.resolveDir };
        });
    },
});
