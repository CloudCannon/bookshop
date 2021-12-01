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
