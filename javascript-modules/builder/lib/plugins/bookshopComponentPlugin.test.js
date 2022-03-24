import test from 'ava';
import path from 'path';
import { stubExternalPlugin } from '../../.test/common.js';
import bookshopComponentPlugin from './bookshopComponentPlugin.js';
import esbuild from 'esbuild';

test('bookshopComponentPlugin should be defined', t => {
    t.truthy(bookshopComponentPlugin);
});

test('defer the work to the bookshopGlobPlugin', async t => {
    let result = await esbuild.build({
        stdin: {
            contents: `import components from "__bookshop_components__";
            console.log(components);`,
            resolveDir: process.cwd(),
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopComponentPlugin({
                bookshopDirs: [path.join(process.cwd(), './.test/fixtures')]
            }),
            stubExternalPlugin("skip-bookshop-globs", /^__bookshop_glob__/)
        ],
        format: 'esm',
        write: false,
        bundle: true
    });

    t.is(result.errors.length, 0);
    t.is(result.warnings.length, 0);
    let m = /import components from "__bookshop_glob__\(.bookshop.*\)";/;
    t.regex(result.outputFiles[0].text, m);
});
