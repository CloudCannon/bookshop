import path from 'path';
import bookshopStylePlugin from './bookshopStylePlugin.js'
import esbuild from 'esbuild';

test('bookshopStylePlugin should be defined', () => {
    expect(bookshopStylePlugin).toBeDefined();
});

const getCssResult = async () => {
    const dir = __dirname(import.meta.url);
    return await esbuild.build({
        stdin: {
            contents: `import files from "__bookshop_styles__";console.log(files);`,
            resolveDir: dir,
            sourcefile: 'virtual.js'
        },
        plugins: [
            bookshopStylePlugin({
                bookshopDirs: [path.join(dir, './.test/fixtures')]
            }),
        ],
        format: 'esm',
        write: false,
        bundle: true
    });
}

test('import and compile css', async () => {
    const result = await getCssResult();

    expect(result.errors.length).toBe(0);
    expect(result.warnings.length).toBe(0);

    expect(result.outputFiles[0].text).toContain(`palevioletred`);
    expect(result.outputFiles[0].text).toContain(`palegoldenrod`);
});

test('sort shared css above component css', async () => {
    const result = await getCssResult();

    const matcher = /content: "shared";.*content: "component";/;
    expect(result.outputFiles[0].text).toMatch(matcher);
});

test('sort css files alphabetically', async () => {
    const result = await getCssResult();

    const matcher = /palevioletred.*palegoldenrod/;
    expect(result.outputFiles[0].text).toMatch(matcher);
});

test('discover and run postcss', async () => {
    const result = await getCssResult();

    const matcher = /--14-30: clamp/;
    expect(result.outputFiles[0].text).toMatch(matcher);
});