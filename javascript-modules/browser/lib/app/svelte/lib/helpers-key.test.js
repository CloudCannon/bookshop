import test from 'ava';
import {getBookshopKey} from './helpers.js';

test("should get key from component path", t => {
    const path = "components/generic/card/card.bookshop.toml";
    t.deepEqual(getBookshopKey(path), "generic/card");
});
