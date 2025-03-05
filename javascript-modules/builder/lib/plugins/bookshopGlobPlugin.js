import path from 'path';
import fastGlob from 'fast-glob';
import normalizePath from 'normalize-path';

const importFile = (file, index) => {
    return `
    import file${index} from '${file}__bookshop_file__';
    files['${file}'] = file${index};`
}

export default (options) => ({
    name: 'bookshop-glob',
    setup: (build) => {
        build.onResolve({ filter: /^__bookshop_glob__/ }, async (args) => {
            if (!options?.bookshopDirs?.length) return;
            return {
                path: args.path.replace(/^__bookshop_glob__/, ''),
                namespace: 'bookshop-import-glob',
                pluginData: {
                    resolveDirs: options.bookshopDirs
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-glob' }, async (args) => {
            const globs = args.pluginData.resolveDirs.map(dir => {
                return fastGlob(`@(components|shared)/**/*@${normalizePath(args.path)}`, {
                    cwd: normalizePath(dir),
                });
            });
            const globResults = await Promise.all(globs);

            const files = [].concat.apply([], globResults).filter(f => {
              if (options?.bookshopConfig?.ignoreFilePatterns?.length) {
                for (const pattern of options.bookshopConfig.ignoreFilePatterns) {
                  if (pattern.test(f)) return false;
                }
              }
              return true
            }).sort();
            const uniqueFiles = Array.from(new Set(files));

            const output = `
            const files = {};
            ${uniqueFiles.map(importFile).join('\n')}

            export default files;
            `;
            return { contents: output, resolveDir: args.pluginData.resolveDir };
        });
    },
});
