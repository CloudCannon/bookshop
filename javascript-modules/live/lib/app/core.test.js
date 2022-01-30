import test from 'ava';
import { findInStack, storeResolvedPath } from './core.js';

test("Find variable in the stack", async t => {
    let stack = [
        { a: 'page.a' },
        { b: 'page.b' },
        { c: 'page.c' },
        { a: 'page.second_a' },
    ];

    t.is(findInStack('a', stack), 'page.second_a');
    t.is(findInStack('b', stack), 'page.b');
    t.is(findInStack('c', stack), 'page.c');
});

test("Find nested variable in the stack", async t => {
    let stack = [
        { title: 'items' }
    ];

    t.is(findInStack('title.text', stack), 'items.text');
});

test("Set new variable in the stack", async t => {
    let stack = [
        { a: 'page.a' },
        {}
    ];

    storeResolvedPath('b', 'page.location', stack);

    t.deepEqual([
        { a: 'page.a' },
        { b: 'page.location' }
    ], stack);
});

test("Mirror existing variable in the stack", async t => {
    let stack = [
        { a: 'page.a' },
        {}
    ];

    storeResolvedPath('b', 'a', stack);

    t.deepEqual([
        { a: 'page.a' },
        { b: 'page.a' }
    ], stack);
});

test("Extend existing variable in the stack", async t => {
    let stack = [
        { a: 'page.a' },
        {}
    ];

    storeResolvedPath('b', 'a.0', stack);

    t.deepEqual([
        { a: 'page.a' },
        { b: 'page.a.0' }
    ], stack);
});

test("Extend existing dot context in the stack", async t => {
    let stack = [
        { '.': 'Params.content_blocks' },
        {}
    ];

    storeResolvedPath('.', 'text', stack);

    t.deepEqual([
        { '.': 'Params.content_blocks' },
        { '.': 'Params.content_blocks.text' }
    ], stack);
});

test("Track data through context and assigns", async t => {
    let stack = [
        { '.': 'Params.content_blocks' },
        {}
    ];

    storeResolvedPath('$ace', 'text', stack);
    storeResolvedPath('something', '$ace.another', stack);

    t.deepEqual([
        { '.': 'Params.content_blocks' },
        {
            '$ace': 'Params.content_blocks.text',
            'something': 'Params.content_blocks.text.another'
        }
    ], stack);
});

test("$ variables skip scopes", async t => {
    let stack = [
        { '$variable': 'path' },
        { '.': 'Params.content_blocks' },
        {}
    ];

    storeResolvedPath('this', '$variable', stack);

    t.deepEqual([
        { '$variable': 'path' },
        { '.': 'Params.content_blocks' },
        { 'this': 'path' }
    ], stack);
});
