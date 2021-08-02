import path from 'path';
import { createRequire } from 'module';

export default {
    name: 'fix_svelte_path',
    setup(b) {
        const require = createRequire(import.meta.url);
        const svelteFileLocation = require.resolve('svelte');
        const svelteFolderLocation = path.dirname(svelteFileLocation);
        const nodeFolderLocation = path.dirname(svelteFolderLocation);

        b.onResolve({ filter: /^svelte$|^svelte\// }, args => {
            return { path: path.join(nodeFolderLocation,args.path,'index.mjs') }
        });
    }
}