import path from 'path';
import fs from 'fs';
import bookshopComponentPlugin from './lib/plugins/bookshopComponentPlugin.js';
import bookshopConfigPlugin from './lib/plugins/bookshopConfigPlugin.js';
import bookshopFilePlugin from './lib/plugins/bookshopFilePlugin.js';
import bookshopGlobPlugin from './lib/plugins/bookshopGlobPlugin.js'
import bookshopStylesPlugin from '@bookshop/styles';
import esbuild from 'esbuild';

export default async (options) => {
    options = {
        bookshopDirs: [],
        ...options
    }
    const esbuildOptions = {
        write: true,
        watch: false,
        plugins: [],
        ...(options.esbuild || {})
    }

    if (!options.bookshopDirs?.length) {
        throw new Error('No bookshop directories supplied — nothing to build.');
    }
    const suppliedBookshopDirs = options.bookshopDirs;
    options.bookshopDirs = suppliedBookshopDirs?.filter(dir => {return fs.existsSync(dir)});
    if (!options.bookshopDirs?.length) {
        console.error(`Could find any of ${suppliedBookshopDirs.join(", ")}`);
        throw new Error('Referenced bookshop directories were not found on disk — nothing to build.');
    }

    const plugins = esbuildOptions.plugins || [];
    plugins.push(bookshopComponentPlugin(options));
    plugins.push(bookshopConfigPlugin(options));
    plugins.push(bookshopFilePlugin(options));
    plugins.push(bookshopGlobPlugin(options));
    plugins.push(bookshopStylesPlugin(options));

    return await esbuild.build({
        ...esbuildOptions,
        bundle: true,
        plugins: plugins,
    });
}
