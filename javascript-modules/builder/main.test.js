import test from 'ava';
import Builder from './main.js';
import path from 'path';

test('should shake the tree', async t => {
    let result = await Builder({
        esbuild: {
            stdin: {
                contents: `import { extensions } from "@bookshop/jekyll-engine";
                console.log(extensions);`,
                resolveDir: path.join(process.cwd(), './.test/fixtures'),
                sourcefile: 'virtual.js'
            },
            write: false,
            format: 'esm'
        }
    });
    t.is(result.errors.length, 0);
    t.is(result.warnings.length, 0);
    const fileWithoutComments = result.outputFiles[0].text.replace(/^\/\/.*$/gm, '//');
    t.is(fileWithoutComments, `//
var extensions = [".jekyll.html"];

//
console.log(extensions);
`);
});

test('should import styles', async t => {
    let result = await Builder({
        esbuild: {
            stdin: {
                contents: `import styles from "__bookshop_styles__";
                console.log(styles);`,
                resolveDir: path.join(process.cwd(), './.test/fixtures'),
                sourcefile: 'virtual.js'
            },
            write: false,
            format: 'esm'
        },
        bookshopDirs: [
            path.join(process.cwd(), './.test/fixtures'),
            path.join(process.cwd(), './.test/second-fixtures')
        ]
    });
    t.is(result.errors.length, 0);
    t.is(result.warnings.length, 0);
    t.is(result.outputFiles[0].text, `// bookshop-styles-import:_
var __default = "p {\\n  color: palegoldenrod;\\n}\\n\\np {\\n  color: coral;\\n}\\n\\np {\\n  color: chocolate;\\n}\\n\\np {\\n  color: darksalmon;\\n}";

// .test/fixtures/virtual.js
console.log(__default);
`);
});
