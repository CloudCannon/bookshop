import test from 'ava';
import {hydrateComponents} from './helpers.js';

const stubbedEngines = [{
    key: 'stub-engine-a',
    hasComponent: key => key === 'stub-component-a'
}, {
    key: 'stub-engine-b',
    hasComponent: key => key === 'stub-component-b'
}]

const tomlExample = `
[component]
structures = []
label = "Stub"
description = ""
icon = "crop_7_5"
tags = []

[props]
label = "Stub"
type.select = ["A", "B"]`;

const components = {
    "components/stub-component-a/stub-component-a.bookshop.toml": tomlExample,
    "components/stub-component-b/stub-component-b.bookshop.toml": tomlExample
}

test("should hydrate basic components", t => {
    const hydrated = hydrateComponents(components, stubbedEngines);

    t.deepEqual(hydrated["stub-component-a"].frameworks, ["stub-engine-a"]);
    t.deepEqual(hydrated["stub-component-b"].frameworks, ["stub-engine-b"]);

    t.deepEqual(hydrated["stub-component-a"].props, {
        label: "Stub",
        type: "A"
    });

    t.is(hydrated["stub-component-a"].yaml, `label: Stub\ntype: A\n`);

    t.deepEqual(hydrated["stub-component-a"].identity, {
        structures: [],
        label: "Stub",
        description: "",
        icon: "crop_7_5",
        tags: []
    });
});
