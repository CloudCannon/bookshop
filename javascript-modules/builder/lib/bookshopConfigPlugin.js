import path from 'path';

const importEngineConfig = async ([engine, data]) => {
    data.__engine = await import(engine);
}

const joinExtensions = (extensions) => {
    return `(${extensions.join('|')})`;
}

const bundledEngine = ([engine, data], engineIndex) => {
    const __engine = data.__engine;
    delete data.__engine;
    const engineKey = `Engine${engineIndex}`;
    return `
    import {Engine as ${engineKey}} from '${engine}';
    import ${engineKey}Files from "__bookshop_glob__${joinExtensions(__engine.extensions)}";

    engines.push(new ${engineKey}({
        ...${JSON.stringify(data)},
        files: ${engineKey}Files
    }));`;
}

export default (options) => ({
    name: 'bookshop-config-import',
    setup: (build) => {
        build.onResolve({ filter: /^__bookshop_engines__$/ }, async (args) => {
            const primaryBookshopDir = options?.bookshopDirs?.[0];
            if (!primaryBookshopDir) return;
            return {
                path: 'bookshop.config.js',
                namespace: 'bookshop-import-config',
                pluginData: {
                    resolveDir: path.join(primaryBookshopDir, 'bookshop')
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-config' }, async (args) => {
            const {default: config} = await import(path.join(args.pluginData.resolveDir, args.path));
            const engines = Object.entries(config?.engines) || {};
            await Promise.all(engines.map(importEngineConfig));
            const output = `
const engines = [];
${engines.map(bundledEngine).join('\n')}
export default engines;
            `;
            return { contents: output, resolveDir: args.pluginData.resolveDir };
        });
    },
});
