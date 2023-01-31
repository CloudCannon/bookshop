import path from 'path';
import fs from 'fs';
import { createRequire } from 'module';
import { filterBookshops, loadConfig } from './lib/bookshopHelper.js';
import bookshopComponentPlugin from './lib/plugins/bookshopComponentPlugin.js';
import bookshopConfigPlugin from './lib/plugins/bookshopConfigPlugin.js';
import bookshopFilePlugin from './lib/plugins/bookshopFilePlugin.js';
import bookshopGlobPlugin from './lib/plugins/bookshopGlobPlugin.js'
import bookshopStylesPlugin from '@bookshop/styles';
import esbuild from 'esbuild';

const require = createRequire(import.meta.url);
const { version } = require('./package.json');

export default async (options) => {
    options = {
        bookshopDirs: [],
        ...options
    }
    const esbuildOptions = {
        write: true,
        watch: false,
        plugins: [],
        loader: {},
        define: {},
        ...(options.esbuild || {})
    }
    esbuildOptions.loader[".bookshop.toml"] = "text";
    esbuildOptions.loader[".bookshop.yml"] = "text";
    esbuildOptions.loader[".bookshop.json"] = "text";

    esbuildOptions.define["BOOKSHOP_VERSION"] = JSON.stringify(version);
    esbuildOptions.define["BOOKSHOP_COMPONENT_BROWSER"] = true;

    options.bookshopDirs = filterBookshops(options.bookshopDirs);
    options.bookshopConfig = await loadConfig(options.bookshopDirs[0]);

    esbuildOptions.plugins.push(bookshopComponentPlugin(options));
    esbuildOptions.plugins.push(bookshopConfigPlugin(options));
    esbuildOptions.plugins.push(bookshopFilePlugin(options));
    esbuildOptions.plugins.push(bookshopGlobPlugin(options));
    esbuildOptions.plugins.push(bookshopStylesPlugin(options));

    options.bookshopConfig?.engines?.forEach(engine => {
        engine?.buildPlugins?.forEach(plugin => {
            esbuildOptions.plugins.push(plugin);
        });
        esbuildOptions.loader = {
            ...esbuildOptions.loader,
            ...(engine?.buildLoaders || {})
        };
        engine?.esbuildConfigFn?.(esbuildOptions, options);
    });

    return await esbuild.build({
        ...esbuildOptions,
        bundle: true,
        metafile: true,
    });
}
