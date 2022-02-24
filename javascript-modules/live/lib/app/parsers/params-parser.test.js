import test from 'ava';
import { ParamsParser } from './params-parser.js';

test(`Hugo dict`, async t => {
    const params = `bind: (dict "contents" .Params.contents )`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["bind", `(dict "contents" .Params.contents )`]
    ]);
});

test(`Nested Hugo dict`, async t => {
    const params = `bind: (dict "a" (slice 1 2 3))`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["bind", `(dict "a" (slice 1 2 3))`]
    ]);
});

test(`Hugo double parentheses`, async t => {
    const params = `bind: ((dict "a" (slice 1 2 3)))`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["bind", `(dict "a" (slice 1 2 3))`]
    ]);
});

test(`Bare variable`, async t => {
    const params = `title: page.title[3]`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["title", `page.title[3]`]
    ]);
});

test(`Bare variable parentheses`, async t => {
    const params = `title: ($g)`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["title", `$g`]
    ]);
});

test(`Quoted strings`, async t => {
    const params = `a: "Hello World" b: 'Hi Globe' c: \`Hey Earth\``;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["a", `"Hello World"`],
        ["b", `'Hi Globe'`],
        ["c", "`Hey Earth`"]
    ]);
});

test(`Quoted strings parentheses`, async t => {
    const params = `a: ("Hello World") b: ('Hi Globe') c: (\`Hey\`)`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["a", `("Hello World")`],
        ["b", `('Hi Globe')`],
        ["c", "`Hey`"]
    ]);
});

test(`Escaped strings`, async t => {
    const params = `key: "He\\\`llo \\"Wo'rld" next: ""`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["key", `"He\`llo "Wo'rld"`],
        ["next", `""`],
    ]);
});

test(`Complex keys`, async t => {
    const params = `num\\:be r: 1234`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["num:be r", `1234`],
    ]);
});

test(`Equals notation`, async t => {
    const params = `item="result" number=4`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["item", `"result"`],
        ["number", `4`],
    ]);
});

test(`Escaped escape`, async t => {
    const params = `item="result\\\\"`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["item", `"result\\"`],
    ]);
});

test(`Extraneous whitespace`, async t => {
    const params = `    k:       "v"   a: 4`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["k", `"v"`],
        ["a", `4`]
    ]);
});

test(`Ranges`, async t => {
    const params = `t=(min..max)[0]`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["t", `(min..max)[0]`]
    ]);
});

test(`Multiline Hugo dict`, async t => {
    const params = `bind: (dict 
"a" (slice 
        1 
        2 
        3
    )
)`;
    const output = (new ParamsParser(params)).build();
    t.deepEqual(output, [
        ["bind", `(dict 
"a" (slice 
        1 
        2 
        3
    )
)`]
    ]);
});