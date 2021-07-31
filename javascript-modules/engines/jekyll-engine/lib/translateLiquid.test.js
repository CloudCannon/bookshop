import test from 'ava';
import translateLiquid from './translateLiquid.js';

test("add unbind tag", t => {
    const input = `🙂`;
    const expected = `{% unbind %}🙂`;
    t.is(translateLiquid(input), expected);
});

test("add emulate_jekyll tag in includes", t => {
    const input = `🙂`;
    const expected = `{% emulate_jekyll %}🙂`;
    t.is(translateLiquid(input, {expandBindSyntax: false, isInclude: true}), expected);
});

test("add multiple tags", t => {
    const input = `🙂`;
    const output = translateLiquid(input, {isInclude: true});
    t.regex(output, /unbind/);
    t.regex(output, /emulate_jekyll/);
});

test("rewrite include syntax", t => {
    const input = `{% include file-name.html prop=page.item %}`;
    const expected = `{% include "file-name.html" prop: page.item %}`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), expected);
});

test("rewrite include_cached tags", t => {
    const input = `{% include_cached file-name.html prop=page.item %}`;
    const expected = `{% include "file-name.html" prop: page.item %}`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), expected);
});

test("rewrite bookshop tags", t => {
    const input = `{% bookshop component prop=page.item %}`;
    const expected = `{% include "_bookshop_component" prop: page.item %}`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), expected);
});

test("ignore variables named include", t => {
    const input = `{% bookshop component bind=include %}`;
    const expected = `{% include "_bookshop_component" bind: include %}`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), expected);
});

test("ignore the rest", t => {
    const input = `<div><h1>{{ page.title | default: "Hello World" }}</h1></div>`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), input);
});
