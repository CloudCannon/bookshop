import fs from 'fs/promises';
import fsc from 'fs';
import path from 'path';

const loadFileFromBookshops = async (bookshops, file) => {
    for (const dir of bookshops) {
        const filePath = path.join(dir, file);
        try {
            await fs.access(filePath, fsc.constants.R_OK);
            return {
                resolveDir: dir,
                filePath: filePath
            }
        } catch (e) {}
    }
    return {
        resolveDir: "",
        filePath: ""
    }
};

export default (options) => ({
    name: 'bookshop-file',
    setup: (build) => {
        build.onResolve({ filter: /__bookshop_file__$/ }, async (args) => {
            if (!options?.bookshopDirs?.length) return;
            return {
                path: args.path,
                namespace: 'bookshop-import-file',
                pluginData: {
                    resolveDirs: options.bookshopDirs
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-file' }, async (args) => {
            const path = args.path.replace(/__bookshop_file__$/, '');
            const {resolveDir, filePath} = await loadFileFromBookshops(args.pluginData.resolveDirs, path);
            if (!filePath) return {contents: ""};

            const fileContents = [
                `import file from "./${path}";`,
                `export default file;`
            ].join('\n');

            return { 
                contents: fileContents, 
                resolveDir: resolveDir,
                watchFiles: [filePath]
            };
        });
    },
});
