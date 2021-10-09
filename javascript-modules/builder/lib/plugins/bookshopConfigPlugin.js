import path from 'path';
import url from 'url';
import normalizePath from 'normalize-path';

const importEngineConfig = async ([engine, data]) => {
    const __engine = await import(`${engine}/build`);
    return [
        engine,
        {
            ...data,
            __engine
        }
    ];
}

const joinExtensions = (extensions) => {
    return `(${extensions.join('|')})`;
}

const bundledEngine = (resolveDir) => {
    return ([engine, data], engineIndex) => {
        const __engine = data.__engine;
        delete data.__engine;
        const engineKey = `Engine${engineIndex}`;
        data.plugins = data.plugins || [];
        return `
        import {Engine as ${engineKey}} from '${engine}';
        import ${engineKey}Files from "__bookshop_glob__${joinExtensions(__engine.extensions)}";

        const ${engineKey}Plugins = [];
        ${data.plugins.map(bundledPlugin(resolveDir, engineKey)).join('\n')}

        engines.push(new ${engineKey}({
            ...${JSON.stringify(data)},
            files: ${engineKey}Files,
            plugins: ${engineKey}Plugins
        }));`;
    }
}

const bundledPlugin = (resolveDir, engineKey) => {
    return (plugin, pluginIndex) => {
        const pluginPath = plugin[0] === "." ? normalizePath(path.join(resolveDir, plugin)) : plugin;
        const pluginKey = `${engineKey}Plugin${pluginIndex}`;
        return `
        import ${pluginKey} from '${pluginPath}';
        ${engineKey}Plugins.push(${pluginKey});`;
    }
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
                    resolveDir: path.join(primaryBookshopDir, 'bookshop'),
                },
            };
        });
        build.onLoad({ filter: /.*/, namespace: 'bookshop-import-config' }, async (args) => {
            const {default: config} = await import(url.pathToFileURL(path.join(args.pluginData.resolveDir, args.path)));
            let engines = Object.entries(config?.engines) || [];
            if (options?.onlyEngines?.length) {
                engines = engines.filter(([engine]) => options.onlyEngines.includes(engine));
            }
            engines = await Promise.all(engines.map(importEngineConfig));
            const output = `
const engines = [];
${engines.map(bundledEngine(args.pluginData.resolveDir)).join('\n')}
export default engines;
            `;
            return { contents: output, resolveDir: process.cwd() };
        });
    },
});
