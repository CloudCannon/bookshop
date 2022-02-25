import test from 'ava';
import { CommentParser } from './comment-parser.js';

test(`Returns parenthetised groups`, async t => {
    const comment = `name(test) another_name(inner text)`;
    const output = (new CommentParser(comment)).build();
    t.deepEqual(output, {
        name: "test",
        another_name: "inner text"
    });
});

test(`Handles nested parentheses`, async t => {
    const comment = `name(test) params(bind: (dict "contents" .Params.contents ))`;
    const output = (new CommentParser(comment)).build();
    t.deepEqual(output, {
        name: "test",
        params: `bind: (dict "contents" .Params.contents )`
    });
});

test(`Handles escaped characters`, async t => {
    const comment = `na\\(me(te\\)st)`;
    const output = (new CommentParser(comment)).build();
    t.deepEqual(output, {
        "na(me": "te)st"
    });
});

test(`Handles EOS as boolean`, async t => {
    const comment = `name(someone) blue`;
    const output = (new CommentParser(comment)).build();
    t.deepEqual(output, {
        "name": "someone",
        "blue": true
    });
});

test(`Handles multiline comments`, async t => {
    const comment = `name(test)
                     another_name(inner 
                                        text)`;
    const output = (new CommentParser(comment)).build();
    t.deepEqual(output, {
        name: "test",
        another_name: "inner \n                                        text"
    });
});