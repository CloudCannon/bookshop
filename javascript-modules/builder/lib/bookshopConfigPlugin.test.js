import path from 'path';
import bookshopConfigPlugin from './bookshopConfigPlugin.js';
import esbuild from 'esbuild';

test('bookshopConfigPlugin should be defined', () => {
    expect(bookshopConfigPlugin).toBeDefined();
});

test('build @bookshop/jekyll-engine without failures', async () => {
    const dir = __dirname(import.meta.url);
    let result = await esbuild.build({
        stdin: {
            contents: `import bookshop from "__bookshop_state__";
            console.log(bookshop);`,
            resolveDir: dir,
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopConfigPlugin({
                bookshopDirs: [path.join(dir, '../.test/fixtures')]
            }),
            stubExternalPlugin("skip-bookshop-globs", /^__bookshop_glob__/),
            stubExternalPlugin("skip-bookshop-globs", /^@bookshop/)
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
    
    expect(result.errors.length).toBe(0);
    expect(result.warnings.length).toBe(0);
    expect(result.outputFiles[0].text).toContain([
        `import {Engine as Engine0} from "@bookshop/jekyll-engine";`,
        `import Engine0Files from "__bookshop_glob__(.jekyll.html)";`
    ].join('\n'));
});
