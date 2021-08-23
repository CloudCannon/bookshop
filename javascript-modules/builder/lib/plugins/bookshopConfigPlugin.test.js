import test from 'ava';
import path from 'path';
import {stubExternalPlugin} from '../../.test/common.js';
import bookshopConfigPlugin from './bookshopConfigPlugin.js';
import esbuild from 'esbuild';

test('bookshopConfigPlugin should be defined', t => {
    t.truthy(bookshopConfigPlugin);
});

test('build @bookshop/jekyll-engine without failures', async t => {
    let result = await esbuild.build({
        stdin: {
            contents: `import bookshop from "__bookshop_engines__";
            console.log(bookshop);`,
            resolveDir: process.cwd(),
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopConfigPlugin({
                bookshopDirs: [path.join(process.cwd(), './.test/fixtures')]
            }),
            stubExternalPlugin("skip-bookshop-globs", /^__bookshop_glob__/),
            stubExternalPlugin("skip-bookshop-globs", /^@bookshop/)
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
    
    t.is(result.errors.length, 0);
    t.is(result.warnings.length, 0);
    t.regex(result.outputFiles[0].text, /import {\s*Engine as Engine0\s*} from "@bookshop\/jekyll-engine";/);
    t.regex(result.outputFiles[0].text, /import Engine0Files from "__bookshop_glob__\(.jekyll.html\)";/);
});
