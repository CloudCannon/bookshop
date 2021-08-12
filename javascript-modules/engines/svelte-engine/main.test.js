import test from 'ava';
import { Engine } from './main.js';

const component = (k) => `components/${k}/${k}.svelte`;
const files = {
    [component('title')]: class Title {
        constructor(opts) {
            opts.target.render = opts.props; // stubbing stuff to test the data flow
        }
    }
}

const sv = new Engine({files});

test("should find components", async t => {
    t.is(sv.hasComponent('title'), true);
});

test("should not find components", async t => {
    t.is(sv.hasComponent('subtitle'), false);
});

test("basic data flow is correct", async t => {
    const target = {}, props = {data: "passthrough"};
    await sv.render(target, "title", props, {global: true});
    t.deepEqual(target, {render: {data: "passthrough", global: true}});
});
