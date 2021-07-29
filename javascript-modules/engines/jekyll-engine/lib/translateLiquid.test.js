import translateLiquid from './translateLiquid.js';

test("add unbind tag", () => {
    const input = `🙂`;
    const expected = `{% unbind %}🙂`;
    expect(translateLiquid(input)).toBe(expected);
});

test("add emulate_jekyll tag in includes", () => {
    const input = `🙂`;
    const expected = `{% emulate_jekyll %}🙂`;
    expect(translateLiquid(input, {expandBindSyntax: false, isInclude: true})).toBe(expected);
});

test("add multiple tags", () => {
    const input = `🙂`;
    const output = translateLiquid(input, {isInclude: true});
    expect(output).toMatch(/unbind/);
    expect(output).toMatch(/emulate_jekyll/);
});

test("rewrite include syntax", () => {
    const input = `{% include file-name.html prop=page.item %}`;
    const expected = `{% include "file-name.html" prop: page.item %}`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(expected);
});

test("rewrite include_cached tags", () => {
    const input = `{% include_cached file-name.html prop=page.item %}`;
    const expected = `{% include "file-name.html" prop: page.item %}`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(expected);
});

test("rewrite bookshop tags", () => {
    const input = `{% bookshop component prop=page.item %}`;
    const expected = `{% include "component" prop: page.item %}`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(expected);
});

test("ignore variables named include", () => {
    const input = `{% bookshop component bind=include %}`;
    const expected = `{% include "component" bind: include %}`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(expected);
});

test("ignore the rest", () => {
    const input = `<div><h1>{{ page.title | default: "Hello World" }}</h1></div>`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(input);
});
