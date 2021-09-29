import test from 'ava';
import translateLiquid from './translateLiquid.js';

test("add unbind tag", t => {
    const input = `🙂`;
    const expected = `{% unbind %}🙂`;
    t.is(translateLiquid(input), expected);
});

test("rewrite unquoted bookshop tags", t => {
    const input = `{% bookshop component prop: page.item %}`;
    const expected = `{% include _bookshop_component prop: page.item %}`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), expected);
});

test("rewrite bookshop tags", t => {
    const input = `{% bookshop "component" prop: page.item %}`;
    const expected = `{% include "_bookshop_component" prop: page.item %}`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), expected);
});

test("rewrite bookshop_include tags", t => {
    const input = `{% bookshop_include "helper" prop: page.item %}`;
    const expected = `{% include "_bookshop_include_helper" prop: page.item %}`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), expected);
});

test("ignore the rest", t => {
    const input = `<div><h1>{{ title | default: "Hello World" }}</h1></div>`;
    t.is(translateLiquid(input, {expandBindSyntax: false}), input);
});
