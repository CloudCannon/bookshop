import test from 'ava';
import path from 'path';
import Builder from '@bookshop/builder';

test('should import svelte engine', async t => {
    let result = await Builder({
        esbuild: {
            stdin: {
                contents: `import engines from "__bookshop_engines__";
                console.log(engines);`,
                resolveDir: process.cwd(),
                sourcefile: 'virtual.js'
            },
            write: false,
            format: 'esm'
        },
        bookshopDirs: [
            path.join(process.cwd(), './.test/fixtures')
        ]
    });
    t.is(result.errors.length, 0);
    // t.is(result.warnings.length, 0);
    t.regex(result.outputFiles[0].text, /Svelte Engine Fixtures Folder/);
});

test('should import svelte files', async t => {
    let result = await Builder({
        esbuild: {
            stdin: {
                contents: `import engines from "__bookshop_engines__";
                console.log(engines);`,
                resolveDir: process.cwd(),
                sourcefile: 'virtual.js'
            },
            write: false,
            format: 'esm'
        },
        bookshopDirs: [
            path.join(process.cwd(), './.test/fixtures')
        ]
    });
    t.is(result.errors.length, 0);
    // t.is(result.warnings.length, 0);
    t.regex(result.outputFiles[0].text, /testing_card/);
});
