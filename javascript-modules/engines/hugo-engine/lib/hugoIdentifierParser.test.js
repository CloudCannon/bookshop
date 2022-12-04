import test from 'ava';
import { IdentifierParser } from './hugoIdentifierParser.js';

test(`Dict with parameter`, async t => {
    const ident = `(dict "contents" .Params.contents)`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, {
        "contents": "Params.contents"
    });
});

test(`Dict with string`, async t => {
    const ident = `(dict "title" "text")`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, {
        "title": `"text"`
    });
});

test(`Dict with parentheses`, async t => {
    const ident = `(dict "length" (len .arr))`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, {
        "length": "(len .arr)"
    });
});


test(`Larger dict`, async t => {
    const ident = `(dict "title" "text" "contents" .Params.contents "number" 5)`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, {
        "title": `"text"`,
        "contents": "Params.contents",
        "number": "5"
    });
});

test(`Slice`, async t => {
    const ident = `(slice "text" .Params.contents 5)`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, [`"text"`, "Params.contents", "5"]);
});

test(`Unknown functions untouched`, async t => {
    const ident = `(len .array)`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, `(len .array)`);
});

test(`Values untouched`, async t => {
    const ident = `"Something"`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, `"Something"`);
});

test(`Nested dicts and slices`, async t => {
    const ident = `(dict "contents" (slice 1 "2" (dict "a" .Params.b)) "len" (len .some_array))`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, {
        "contents": ["1", `"2"`, {
            "a": "Params.b"
        }],
        "len": "(len .some_array)"
    });
});

test(`Converts an index into dot notation`, async t => {
    let ident = `(index (.items) 5)`;
    let output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, `items.5`);

    ident = `(index .array 5)`;
    output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, `array.5`);

    ident = `(index $variable 5)`;
    output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, `$variable.5`);
});


test(`Converts a dot index into a JS object property`, async t => {
    let ident = `(index (.) 5)`;
    let output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, `5`);

    ident = `(index . 1234)`;
    output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, `1234`);
});

test(`Multiline dicts and slices`, async t => {
    const ident = `(dict 
"contents" 
(slice 1 "2" 
    (dict 
        "a" .Params.b)
) "len" (
    len
    .some_array
))`;
    const output = (new IdentifierParser(ident)).build();
    t.deepEqual(output, {
        "contents": ["1", `"2"`, {
            "a": "Params.b"
        }],
        "len": `(\n    len\n    .some_array\n)`
    });
});