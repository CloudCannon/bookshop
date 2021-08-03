import test from 'ava';
import path from 'path';
import {stubExternalPlugin} from '../.test/common.js';
import bookshopGlobPlugin from './bookshopGlobPlugin.js'
import esbuild from 'esbuild';

test('bookshopGlobPlugin should be defined', t => {
    t.truthy(bookshopGlobPlugin);
});

test('import components', async t => {
    let result = await esbuild.build({
        stdin: {
            contents: `import files from "__bookshop_glob__(.jekyll.html)";`,
            resolveDir: process.cwd(),
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopGlobPlugin({
                bookshopDirs: [
                    path.join(process.cwd(), './.test/fixtures'),
                    path.join(process.cwd(), './.test/second-fixtures')
                ]
            }),
            stubExternalPlugin("skip-bookshop-files", /^__bookshop_file__/)
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
    
    t.is(result.errors.length, 0);
    t.is(result.warnings.length, 0);
    
    let m = /import file0 from "__bookshop_file__components\/card\/card.jekyll.html";/;
    t.regex(result.outputFiles[0].text, m);
    
    m = /files\["components\/card\/card.jekyll.html"\] = file0;/;
    t.regex(result.outputFiles[0].text, m);
    
    m = /import file1 from "__bookshop_file__components\/dos\/dos.jekyll.html";/;
    t.regex(result.outputFiles[0].text, m);
    
    m = /files\["components\/dos\/dos.jekyll.html"\] = file1;/;
    t.regex(result.outputFiles[0].text, m);
});
