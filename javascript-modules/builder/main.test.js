import Builder from './main.js';
import path from 'path';

test('should shake the tree', async () => {
    const dir = __dirname(import.meta.url);

    let result = await Builder({
        esbuild: {
            stdin: {
                contents: `import { extensions } from "@bookshop/jekyll-engine";
                console.log(extensions);`,
                resolveDir: path.join(dir, './.test/fixtures'),
                sourcefile: 'virtual.js'
            },
            write: false,
            format: 'esm'
        }
    });
    expect(result.errors.length).toBe(0);
    expect(result.warnings.length).toBe(0);
    expect(result.outputFiles[0].text).toBe(`// ../engines/jekyll-engine/lib/builder.js
var extensions = [".jekyll.html"];

// .test/fixtures/virtual.js
console.log(extensions);
`);
});
