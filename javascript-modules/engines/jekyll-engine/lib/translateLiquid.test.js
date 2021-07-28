const translateLiquid = require('./translateLiquid');

test("add unbind tag", () => {
    input = `🙂`;
    expected = `{% unbind %}🙂`;
    expect(translateLiquid(input)).toBe(expected);
});

test("add emulate_jekyll tag in includes", () => {
    input = `🙂`;
    expected = `{% emulate_jekyll %}🙂`;
    expect(translateLiquid(input, {expandBindSyntax: false, isInclude: true})).toBe(expected);
});

test("add multiple tags", () => {
    input = `🙂`;
    output = translateLiquid(input, {isInclude: true});
    expect(output).toMatch(/unbind/);
    expect(output).toMatch(/emulate_jekyll/);
});

test("rewrite include syntax", () => {
    input = `{% include file-name.html prop=page.item %}`;
    expected = `{% include "file-name.html" prop: page.item %}`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(expected);
});

test("rewrite include_cached tags", () => {
    input = `{% include_cached file-name.html prop=page.item %}`;
    expected = `{% include "file-name.html" prop: page.item %}`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(expected);
});

test("rewrite bookshop tags", () => {
    input = `{% bookshop component prop=page.item %}`;
    expected = `{% include "component" prop: page.item %}`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(expected);
});

test("ignore variables named include", () => {
    input = `{% bookshop component bind=include %}`;
    expected = `{% include "component" bind: include %}`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(expected);
});

test("ignore the rest", () => {
    input = `<div><h1>{{ page.title | default: "Hello World" }}</h1></div>`;
    expect(translateLiquid(input, {expandBindSyntax: false})).toBe(input);
});
