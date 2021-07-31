import test from 'ava';
import path from 'path';
import bookshopFilePlugin from './bookshopFilePlugin.js';
import esbuild from 'esbuild';

test('bookshopFilePlugin should be defined', t => {
    t.truthy(bookshopFilePlugin);
});

test('import a component as text', async t => {
    let result = await esbuild.build({
        stdin: {
            contents: `import file from "__bookshop_file__components/card/card.jekyll.html";
            console.log(file);`,
            resolveDir: process.cwd(),
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopFilePlugin({
                bookshopDirs: [path.join(process.cwd(), './.test/fixtures')]
            })
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
    
    t.is(result.errors.length, 0);
    t.is(result.warnings.length, 0);
    t.regex(result.outputFiles[0].text, /<p>card<\/p>/);
});
