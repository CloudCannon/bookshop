import path from 'path';
import fs from 'fs';
import url from 'url';
import normalizePath from 'normalize-path';
import resolve from 'resolve';

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

        let engineImportPath = engine;
        if (process.platform !== "win32") {
            // TODO: It looks like resolve is mangling this path on Windows
            // This is a pretty obscure fix and is more likely to affect CI,
            // so opting Windows out of this for now.
            try {
                // Try to force loading the engine from cwd if we can resolve it
                engineImportPath = resolve.sync(engine, { basedir: process.cwd() });
            } catch (e) { }
        }
        return `
        import {Engine as ${engineKey}} from '${engineImportPath}';
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
            let primaryConfig = path.join(args.pluginData.resolveDir, 'bookshop.config.js');
            if (!fs.existsSync(primaryConfig)) {
                primaryConfig = path.join(args.pluginData.resolveDir, 'bookshop.config.cjs');
            }
            if (!fs.existsSync(primaryConfig)) {
                throw new Error("Couldn't find a bookshop.config.* file.")
            }
            const { default: config } = await import(url.pathToFileURL(primaryConfig));
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
