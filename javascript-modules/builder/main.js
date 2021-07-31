import path from 'path';
import bookshopStylesPlugin from '@bookshop/styles';
import bookshopComponentPlugin from './lib/bookshopComponentPlugin.js';
import bookshopConfigPlugin from './lib/bookshopConfigPlugin.js';
import bookshopGlobPlugin from './lib/bookshopGlobPlugin.js'
import esbuild from 'esbuild';

export default async (options) => {
    const esbuildOptions = {
        write: true,
        watch: false,
        plugins: [],
        ...(options?.esbuild || {})
    }

    const plugins = esbuildOptions.plugins || [];
    plugins.push(bookshopStylesPlugin(options));
    plugins.push(bookshopComponentPlugin(options));
    plugins.push(bookshopConfigPlugin(options));
    plugins.push(bookshopGlobPlugin(options));

    return await esbuild.build({
        ...esbuildOptions,
        bundle: true,
        plugins: plugins,
    });
}
