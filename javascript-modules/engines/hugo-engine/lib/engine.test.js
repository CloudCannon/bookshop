import test from 'ava';
import { Engine } from './engine__test__.js';

let engine = null, logger = null;
test.before(async t => {
    engine = new Engine({ synthetic: true });
    logger = {
        log: (str) => console.log(str),
        nested: () => logger,
    }
});

test("eval value", async t => {
    const val = await engine.eval(`.test`, [{ test: 'bookshop' }]);
    t.is(val, 'bookshop');
});

test("eval variable", async t => {
    const val = await engine.eval(`$var`, [{ "$var": 'string' }, { test: 'bookshop' }]);
    t.is(val, 'string');
});

test("eval literals", async t => {
    let val = await engine.eval(`"test"`, [{}]);
    t.is(val, 'test');

    val = await engine.eval("`test`", [{}]);
    t.is(val, 'test');

    val = await engine.eval("4", [{}]);
    t.is(val, 4);

    val = await engine.eval("99.9", [{}]);
    t.is(val, 99.9);

    val = await engine.eval("true", [{}]);
    t.is(val, true);

    val = await engine.eval("false", [{}]);
    t.is(val, false);
});

test("eval through dot scope", async t => {
    const val_later = await engine.eval(`.test`, [{ test: 'bookshop' }, { ".": { test: 'inner_bookshop' } }]);
    t.is(val_later, 'inner_bookshop');

    const val_earlier = await engine.eval(`.test`, [{ ".": { test: 'inner_bookshop' } }, { test: 'bookshop' }]);
    t.is(val_earlier, 'inner_bookshop');
});

test("access dot scope", async t => {
    const dot = await engine.eval(`.`, [{ test: 'bookshop' }]);
    t.deepEqual(dot, { test: 'bookshop' });

    const dot_dot = await engine.eval(`.`, [{ test: 'bookshop' }, { ".": { test: 'inner_bookshop' } }]);
    t.deepEqual(dot_dot, { test: 'inner_bookshop' });
});

test("eval literal dict", async t => {
    const dot = await engine.eval(`(dict "zanzibar" "gin")`, [{}]);
    t.deepEqual(dot, { zanzibar: 'gin' });
});

test("eval dict with scope access", async t => {
    const dot = await engine.eval(`(dict "zanzibar" .live)`, [{ live: "editing" }]);
    t.deepEqual(dot, { zanzibar: 'editing' });
});

test("eval dict with variable access", async t => {
    const dot = await engine.eval(`(dict "zanzibar" $live)`, [{ "$live": "editing" }]);
    t.deepEqual(dot, { zanzibar: 'editing' });
});

test("eval complex dict", async t => {
    const dot = await engine.eval(`(dict "zanzibar" (slice .edit .live) "and" "a_literal")`, [{ live: "editing" }, { edit: "live" }]);
    t.deepEqual(dot, { zanzibar: ['live', 'editing'], and: 'a_literal' });
});

test("eval array index", async t => {
    const dot = await engine.eval(`(index .live 1)`, [{ live: ["editing", "lively"] }]);
    t.deepEqual(dot, "lively");
});
