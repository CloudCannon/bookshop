import test from 'ava';
import { getBookshopKey, hydrateComponents } from './helpers.js';

const engineMock = [
    {
        hasComponent: () => true,
        key: "test"
    }
];

test("should get key from component path", t => {
    const path = "components/generic/card/card.bookshop.toml";
    t.deepEqual(getBookshopKey(path), "generic/card");
});

test("should hydrate component references", t => {
    const components = {
        "components/button/button.bookshop.json": JSON.stringify({
            blueprint: {
                text: ""
            },
            preview: {
                text: "Hello World"
            }
        }),
        "components/hero/hero.bookshop.json": JSON.stringify({
            blueprint: {
                title: "Hello World",
                button: "bookshop:button"
            }
        })
    };
    const hydrated = hydrateComponents(components, engineMock);
    t.deepEqual(hydrated.hero.props, {
        _bookshop_name: "hero",
        title: "Hello World",
        button: {
            _bookshop_name: "button",
            text: "Hello World"
        }
    });
});

test("should hydrate structure references", t => {
    const components = {
        "components/button/button.bookshop.json": JSON.stringify({
            spec: {
                structures: ["test"]
            },
            blueprint: {
                text: "Hello World"
            }
        }),
        "components/hero/hero.bookshop.json": JSON.stringify({
            blueprint: {
                title: "Hello World",
                something: "bookshop:structure:test"
            }
        })
    };
    const hydrated = hydrateComponents(components, engineMock);
    t.deepEqual(hydrated.hero.props, {
        _bookshop_name: "hero",
        title: "Hello World",
        something: {
            _bookshop_name: "button",
            text: "Hello World"
        }
    });
});

test("preview data overrides component references", t => {
    const components = {
        "components/button/button.bookshop.json": JSON.stringify({
            blueprint: {
                text: "Hello World"
            }
        }),
        "components/hero/hero.bookshop.json": JSON.stringify({
            blueprint: {
                title: "Hello World",
                button: "bookshop:button"
            },
            preview: {
                button: {
                    hello: "World"
                }
            }
        })
    };
    const hydrated = hydrateComponents(components, engineMock);
    t.deepEqual(hydrated.hero.props, {
        _bookshop_name: "hero",
        title: "Hello World",
        button: {
            hello: "World"
        }
    });
});

test("preview data overrides component array references", t => {
    const components = {
        "components/button/button.bookshop.json": JSON.stringify({
            blueprint: {
                text: "Hello World"
            }
        }),
        "components/hero/hero.bookshop.json": JSON.stringify({
            blueprint: {
                title: "Hello World",
                buttons: ["bookshop:button"]
            },
            preview: {
                buttons: [{
                    text: "Hello"
                }, {
                    text: "World"
                }]
            }
        })
    };
    const hydrated = hydrateComponents(components, engineMock);
    t.deepEqual(hydrated.hero.props, {
        _bookshop_name: "hero",
        title: "Hello World",
        buttons: [{
            text: "Hello"
        }, {
            text: "World"
        }]
    });
});

test("preview data can reference nested components", t => {
    const components = {
        "components/button/button.bookshop.json": JSON.stringify({
            blueprint: {
                text: "Hello World"
            }
        }),
        "components/hero/hero.bookshop.json": JSON.stringify({
            blueprint: {
                title: "Hello World",
                buttons: ["bookshop:button"]
            },
            preview: {
                buttons: ["bookshop:button", "bookshop:button"]
            }
        })
    };
    const hydrated = hydrateComponents(components, engineMock);
    t.deepEqual(hydrated.hero.props, {
        _bookshop_name: "hero",
        title: "Hello World",
        buttons: [{
            _bookshop_name: "button",
            text: "Hello World"
        }, {
            _bookshop_name: "button",
            text: "Hello World"
        }]
    });
});

// TODO: Re-unit test the browser for 3.0 conventions.