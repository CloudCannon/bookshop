import test from 'ava';
import path from 'path';
import bookshopStylePlugin from './bookshopStylePlugin.js'
import esbuild from 'esbuild';

let compiledCSS = null;
test.before(async t => {
    compiledCSS = await esbuild.build({
        stdin: {
            contents: `import files from "__bookshop_styles__";console.log(files);`,
            resolveDir: process.cwd(),
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopStylePlugin({
                bookshopDirs: [
                    path.join(process.cwd(), './.test/fixtures'),
                    path.join(process.cwd(), './.test/second-fixtures')
                ]
            }),
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
});

test('bookshopStylePlugin should be defined', async t => {
    t.truthy(bookshopStylePlugin);
});

test('css should compile without errors or warnings', async t => {
    t.is(compiledCSS.errors.length, 0);
    t.is(compiledCSS.warnings.length, 0);
});

test('css should compile components', async t => {
    t.regex(compiledCSS.outputFiles[0].text, /palevioletred/);
    t.regex(compiledCSS.outputFiles[0].text, /palegoldenrod/);
});

test('sort shared css above component css', async t => {
    const matcher = /content: "shared";.*content: "component";/;
    t.regex(compiledCSS.outputFiles[0].text, matcher);
});

test('sort css files alphabetically', async t => {
    const matcher = /palevioletred.*palegoldenrod/;
    t.regex(compiledCSS.outputFiles[0].text, matcher);
});

test('discover and run postcss', async t => {
    const matcher = /--14-30: clamp/;
    t.regex(compiledCSS.outputFiles[0].text, matcher);
});

test('compile secondary bookshops', async t => {
    const matcher = /darksalmon/;
    t.regex(compiledCSS.outputFiles[0].text, matcher);
});