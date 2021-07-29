import path from 'path';
import bookshopGlobPlugin from './bookshopGlobPlugin.js'
import esbuild from 'esbuild';

test('bookshopGlobPlugin should be defined', () => {
    expect(bookshopGlobPlugin).toBeDefined();
});

test('import components', async () => {
    const dir = __dirname(import.meta.url);
    let result = await esbuild.build({
        stdin: {
            contents: `const files = require("__bookshop_glob__(.jekyll.html)");`,
            resolveDir: dir,
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopGlobPlugin({
                bookshopDirs: [path.join(dir, '../.test/fixtures')]
            }),
            stubExternalPlugin("skip-bookshop-files", /^__bookshop_file__/)
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
    
    expect(result.errors.length).toBe(0);
    expect(result.warnings.length).toBe(0);
    expect(result.outputFiles[0].text).toContain(
        `import file0 from "__bookshop_file__components/card/card.jekyll.html";`
        );
        expect(result.outputFiles[0].text).toContain(
            `files["components/card/card.jekyll.html"] = file0;`
            );
        });
        