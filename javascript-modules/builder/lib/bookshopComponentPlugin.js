import path from 'path';

export default (options) => ({
    name: 'bookshop-components',
    setup: (build) => {
        build.onResolve({ filter: /^__bookshop_components__/ }, async (args) => {
            const primaryBookshopDir = options?.bookshopDirs?.[0];
            if (!primaryBookshopDir) return;
            return {
                path: args.path,
                namespace: 'bookshop-import-components',
                pluginData: {
                    resolveDir: path.join(primaryBookshopDir)
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-components' }, async (args) => {
            const fileContents = `import components from '__bookshop_glob__(.bookshop.toml)';export default components;`;
            return { contents: fileContents, resolveDir: args.pluginData.resolveDir };
        });
    },
});
