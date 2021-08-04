import fs from 'fs/promises';
import path from 'path';

const loadFileFromBookshops = async (bookshops, file) => {
    for (const dir of bookshops) {
        const filePath = path.join(dir, file);
        try {
            const fileContents = await fs.readFile(filePath, 'utf8');
            return {
                fileContents: fileContents,
                resolveDir: dir,
                filePath: filePath
            }
        } catch (e) {}
    }
    return {
        fileContents: "",
        resolveDir: "",
        filePath: ""
    }
};

export default (options) => ({
    name: 'bookshop-file',
    setup: (build) => {
        build.onResolve({ filter: /^__bookshop_file__/ }, async (args) => {
            if (!options?.bookshopDirs?.length) return;
            return {
                path: args.path.replace(/^__bookshop_file__/, ''),
                namespace: 'bookshop-import-file',
                pluginData: {
                    resolveDirs: options.bookshopDirs
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-file' }, async (args) => {
            const {fileContents, resolveDir, filePath} = await loadFileFromBookshops(args.pluginData.resolveDirs, args.path);

            return { 
                contents: fileContents, 
                loader: 'text', 
                resolveDir: resolveDir,
                watchFiles: [filePath]
            };
        });
    },
});
