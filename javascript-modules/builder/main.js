import path from 'path';
import bookshopComponentPlugin from './lib/bookshopComponentPlugin.js';
import bookshopConfigPlugin from './lib/bookshopConfigPlugin.js';
import BookshopGlobPlugin from './lib/bookshopGlobPlugin.js'
//import BookshopScssImport from './lib/scssImportPlugin';
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
    plugins.push(BookshopGlobPlugin(options));
    // plugins.push(
    //     BookshopScssImport({bookshopDirs: options.bookshopDirs})
    // );
    return await esbuild.build({
        ...esbuildOptions,
        bundle: true,
        plugins: plugins,
    });
}
