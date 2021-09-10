import test from 'ava';
import {Engine} from './engine.js';

let engine = null;
test.before(async t => {
    engine = new Engine();
});

test("get basic component key", t => {
    const input = `card`;
    const expected = `components/card/card.eleventy.liquid`;
    t.is(engine.getComponentKey(input), expected);
});

test("get nested component key", t => {
    const input = `blog/card`;
    const expected = `components/blog/card/card.eleventy.liquid`;
    t.is(engine.getComponentKey(input), expected);
});
