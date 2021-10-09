import test from 'ava';
import {Engine} from './engine.js';

let engine = null;
test.before(async t => {
    engine = new Engine();
});

test("get basic component key", t => {
    const input = `card`;
    const expected = `components/card/card.jekyll.html`;
    t.is(engine.getComponentKey(input), expected);
});

test("get nested component key", t => {
    const input = `blog/card`;
    const expected = `components/blog/card/card.jekyll.html`;
    t.is(engine.getComponentKey(input), expected);
});

test("eval value", async t => {
    const val = await engine.eval(`test`, {test: 'bookshop'});
    t.is(val, 'bookshop');
});

test("eval array", async t => {
    const val = await engine.eval(`test`, {test: ['book','shop']});
    t.deepEqual(val, ['book','shop']);
});

test("eval array index", async t => {
    const val = await engine.eval(`test[0]`, {test: ['book','shop']});
    t.is(val, 'book');
});

test("eval obj", async t => {
    const val = await engine.eval(`test`, {test: {'book':'shop'}});
    t.deepEqual(val, {'book': 'shop'});
});

test("eval obj index", async t => {
    const val = await engine.eval(`test[0]`, {test: {'book':'shop'}});
    t.deepEqual(val, ['book', 'shop']);
});

test("eval range", async t => {
    const val = await engine.eval(`(0..4)[2]`);
    t.is(val, 2);
});

test("eval deep", async t => {
    const val = await engine.eval(`test.inner[0]`, {test: {inner: ['bookshop']}});
    t.is(val, 'bookshop');
});

test("eval scopes", async t => {
    const scopes = [{test: 'jekyll', other: 'eleventy'}, {test: 'hugo'}];
    t.is(await engine.eval(`test`, scopes), 'hugo');
    t.is(await engine.eval(`other`, scopes), 'eleventy');
});
