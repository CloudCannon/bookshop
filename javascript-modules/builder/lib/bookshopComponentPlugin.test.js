import path from 'path';
import bookshopComponentPlugin from './bookshopComponentPlugin.js';
import esbuild from 'esbuild';

test('bookshopComponentPlugin should be defined', () => {
    expect(bookshopComponentPlugin).toBeDefined();
});

test('import a component as text', async () => {
    const dir = __dirname(import.meta.url);
    let result = await esbuild.build({
        stdin: {
            contents: `import file from "__bookshop_file__components/card/card.jekyll.html";
            console.log(file);`,
            resolveDir: dir,
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopComponentPlugin({
                bookshopDirs: [path.join(dir, '../.test/fixtures')]
            })
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
    
    expect(result.errors.length).toBe(0);
    expect(result.warnings.length).toBe(0);
    expect(result.outputFiles[0].text).toContain("<p>card</p>");
});
