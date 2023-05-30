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
    t.is(translateLiquid(input, { expandBindSyntax: false, liveMarkup: false }), expected);
});

test("rewrite bookshop tags", t => {
    const input = `{% bookshop "component" prop: page.item %}`;
    const expected = `{% include "_bookshop_component" prop: page.item %}`;
    t.is(translateLiquid(input, { expandBindSyntax: false, liveMarkup: false }), expected);
});

test("rewrite dynamic bookshop tags", t => {
    const input = `{% bookshop "{{ _bookshop_name }}" prop: page.item %}`;
    const expected = `{% include "_bookshop_{{ _bookshop_name }}" prop: page.item %}`;
    t.is(translateLiquid(input, { expandBindSyntax: false, liveMarkup: false }), expected);
});

test("rewrite unquoted dynamic bookshop tags", t => {
    const input = `{% bookshop {{ _bookshop_name }} prop: page.item %}`;
    const expected = `{% include "_bookshop_{{ _bookshop_name }}" prop: page.item %}`;
    t.is(translateLiquid(input, { expandBindSyntax: false, liveMarkup: false }), expected);
});

test("rewrite unquoted dynamic bookshop include tags", t => {
    const input = `{% bookshop_include {{ _bookshop_name }} prop: page.item %}`;
    const expected = `{% include "_bookshop_include_{{ _bookshop_name }}" prop: page.item %}`;
    t.is(translateLiquid(input, { expandBindSyntax: false, liveMarkup: false }), expected);
});


test("rewrite bookshop_include tags", t => {
    const input = `{% bookshop_include "helper" prop: page.item %}`;
    const expected = `{% include "_bookshop_include_helper" prop: page.item %}`;
    t.is(translateLiquid(input, { expandBindSyntax: false, liveMarkup: false }), expected);
});

test("ignore the rest", t => {
    const input = `<div><h1>{{ title | default: "Hello World" }}</h1></div>`;
    t.is(translateLiquid(input, { expandBindSyntax: false, liveMarkup: false }), input);
});

test("add live markup to bookshop tags", t => {
    const input = `{% bookshop "component" prop: page.item %}`;
    const expected = `<!--bookshop-live name(component) params(prop: page.item)-->{% include "_bookshop_component" prop: page.item %}<!--bookshop-live end-->`;
    t.is(translateLiquid(input, { expandBindSyntax: false }), expected);
});

test("add live markup to bookshop_include tags", t => {
    const input = `{% bookshop_include "helper" prop: page.item %}`;
    const expected = `<!--bookshop-live name(helper) params(prop: page.item)-->{% include "_bookshop_include_helper" prop: page.item %}<!--bookshop-live end-->`;
    t.is(translateLiquid(input, { expandBindSyntax: false }), expected);
});

test("add live markup to assigns", t => {
    const input = `{% assign a=b %}bookshop`;
    const expected = `{% assign a=b %}<!--bookshop-live context(a: (b))-->bookshop`;
    t.is(translateLiquid(input, { expandBindSyntax: false }), expected);
});

test("add live markup to complex assigns", t => {
    const input = `{% assign a = b | where: "a", "b" %}bookshop`;
    const expected = `{% assign a = b | where: "a", "b" %}<!--bookshop-live context(a: (b | where: "a", "b"))-->bookshop`;
    t.is(translateLiquid(input, { expandBindSyntax: false }), expected);
});

test("add live markup to local assigns", t => {
    const input = `{% local a=b %}bookshop`;
    const expected = `{% local a=b %}<!--bookshop-live context(a: (b))-->bookshop`;
    t.is(translateLiquid(input, { expandBindSyntax: false }), expected);
});

test("add live markup to loops", t => {
    const input = `{% for a in b %}bookshop`;
    const expected = `{% for a in b %}{% loop_context a in b %}bookshop`;
    t.is(translateLiquid(input, { expandBindSyntax: false }), expected);
});

test("don't add live markup when no subcomponent", t => {
    const input = `{% assign a=b %}`;
    const expected = `{% assign a=b %}`;
    t.is(translateLiquid(input, { expandBindSyntax: false }), expected);
});