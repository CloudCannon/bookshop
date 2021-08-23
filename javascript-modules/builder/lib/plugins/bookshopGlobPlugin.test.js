import test from 'ava';
import path from 'path';
import {stubExternalPlugin} from '../../.test/common.js';
import bookshopGlobPlugin from './bookshopGlobPlugin.js'
import esbuild from 'esbuild';

let esbuildOutput = "";
test.before(async t => {
    esbuildOutput = await esbuild.build({
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
            stubExternalPlugin("skip-bookshop-files", /__bookshop_file__$/)
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
});

test('bookshopGlobPlugin should be defined', t => {
    t.truthy(bookshopGlobPlugin);
});

test('build without warnings or errors', async t => {
    t.is(esbuildOutput.errors.length, 0);
    t.is(esbuildOutput.warnings.length, 0);
});

test('import a component to the files object', async t => {
    let m = /import file0 from "components\/card\/card\.jekyll\.html__bookshop_file__";/;
    t.regex(esbuildOutput.outputFiles[0].text, m);
    
    m = /files\["components\/card\/card\.jekyll\.html"\] = file0;/;
    t.regex(esbuildOutput.outputFiles[0].text, m);
});

test('import a component from a secondary bookshop', async t => {
    let m = /import file\d from "components\/dos\/dos\.jekyll\.html__bookshop_file__";/;
    t.regex(esbuildOutput.outputFiles[0].text, m);
    
    m = /files\["components\/dos\/dos\.jekyll\.html"\] = file\d;/;
    t.regex(esbuildOutput.outputFiles[0].text, m);
});

test('Reference clashed components only once', async t => {
    let m = /components\/clash\/clash\.jekyll\.html__bookshop_file__/g;
    t.deepEqual(esbuildOutput.outputFiles[0].text.match(m), [
        "components/clash/clash.jekyll.html__bookshop_file__"
    ], "don't reference duplicate files twice");
});

test('import a file from the shared directory', async t => {
    let m = /import file\d from "shared\/jekyll\/title\.jekyll\.html__bookshop_file__";/;
    t.regex(esbuildOutput.outputFiles[0].text, m);
    
    m = /files\["shared\/jekyll\/title\.jekyll\.html"\] = file\d;/;
    t.regex(esbuildOutput.outputFiles[0].text, m);
});
