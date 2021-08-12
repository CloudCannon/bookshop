import test from 'ava';
import {processBookshopProps} from './helpers.js';

test("should do nothing with nothing", t => {
    const input = {
        props: {}
    }
    t.deepEqual(processBookshopProps(input), {});
});

test("should do nothing if nothing needs to be done", t => {
    const input = {
        props: {
            a: 'b',
            c: ['d']
        }
    }
    t.deepEqual(processBookshopProps(input), {a: 'b', c: ['d']});
});

test("should collapse a select to its first option", t => {
    const input = {
        props: {
            type: {
                select: ['a', 'b', 'c']
            }
        }
    }
    t.deepEqual(processBookshopProps(input), {type: 'a'});
});

test("should collapse a select to a default is present", t => {
    const input = {
        props: {
            type: {
                select: ['a', 'b', 'c'],
                default: 'b'
            }
        }
    }
    t.deepEqual(processBookshopProps(input), {type: 'b'});
});

test("should collapse a preview to its first option", t => {
    const input = {
        props: {
            type: {
                preview: ['a', 'b', 'c']
            }
        }
    }
    t.deepEqual(processBookshopProps(input), {type: 'a'});
});

test("should collapse an instance to its value", t => {
    const input = {
        props: {
            id: {
                instance: "UUID"
            }
        }
    }
    t.deepEqual(processBookshopProps(input), {id: 'UUID'});
});

test("should collapse a preview to a default is present", t => {
    const input = {
        props: {
            type: {
                preview: ['a', 'b', 'c'],
                default: 'b'
            }
        }
    }
    t.deepEqual(processBookshopProps(input), {type: 'b'});
});

test("should collapse an object to a default", t => {
    const input = {
        props: {
            type: {
                default: 'type'
            }
        }
    }
    t.deepEqual(processBookshopProps(input), {type: 'type'});
});

test("should recurse into objects", t => {
    const input = {
        props: {
            inner: {
                type: {
                    default: 'type'
                }
            }
        }
    }
    t.deepEqual(processBookshopProps(input), {inner: {type: 'type'}});
});

test("should recurse into arrays", t => {
    const input = {
        props: {
            inner: [
                {
                    type: {
                        default: 'type'
                    }
                }
            ]
        }
    }
    t.deepEqual(processBookshopProps(input), {inner: [{type: 'type'}]});
});