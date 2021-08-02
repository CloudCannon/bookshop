import path from 'path';
import bookshopComponentPlugin from './lib/bookshopComponentPlugin.js';
import bookshopConfigPlugin from './lib/bookshopConfigPlugin.js';
import bookshopFilePlugin from './lib/bookshopFilePlugin.js';
import bookshopGlobPlugin from './lib/bookshopGlobPlugin.js'
import bookshopStylesPlugin from '@bookshop/styles';
import esbuild from 'esbuild';

export default async (options) => {
    const esbuildOptions = {
        write: true,
        watch: false,
        plugins: [],
        ...(options?.esbuild || {})
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
