import path from 'path';

export default (options) => ({
    name: 'bookshop-components',
    setup: (build) => {
        build.onResolve({ filter: /^__bookshop_components__/ }, async (args) => {
            return {
                path: args.path,
                namespace: 'bookshop-import-components',
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-components' }, async (args) => {
            const fileContents = `import components from '__bookshop_glob__(.bookshop.*)';export default components;`;
            return { contents: fileContents };
        });
    },
});
