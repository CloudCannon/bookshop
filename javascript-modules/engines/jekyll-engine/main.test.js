import test from 'ava';
import { Engine } from './main.js';

const component = (k) => `components/${k}/${k}.jekyll.html`;
const shared = (k) => `shared/jekyll/${k}.jekyll.html`;
const files = {
    [component('title')]: "<h1>{{ include.title }}</h1>",
    [component('global-title')]: "<h1>{{ title }}</h1>",
    [component('include-title')]: "{% bookshop title title=\"Hello World\" %}",
    [component('include-global-title')]: "{% bookshop global-title title=\"Hello World\" %}",
    [component('include-title-bind')]: "{% bookshop title bind=include %}",
    [component('include-title-deep-bind')]: "{% bookshop title bind=include.book %}",
    [component('uses-helper')]: "{% bookshop_include helper help=include.label %}",
    [shared('helper')]: "<span data-helper=\"{{include.help}}\"></span>",
}

const je = new Engine({files});

test("should find components", async t => {
    t.is(je.hasComponent('title'), true);
});

test("should not find components", async t => {
    t.is(je.hasComponent('subtitle'), false);
});

test("basic rendering", async t => {
    const rendered = await je.render("title", { title: "test" });
    t.is(rendered, "<h1>test</h1>");
});

test("should render an include", async t => {
    const rendered = await je.render("include-title");
    t.is(rendered, "<h1>Hello World</h1>");
});

test("should not pass through unscoped props", async t => {
    const rendered = await je.render("include-global-title");
    t.is(rendered, "<h1></h1>");
});

test("should pass through global data", async t => {
    const rendered = await je.render("include-global-title", {}, { title: "test" });
    t.is(rendered, "<h1>test</h1>");
});

test("should implement bind syntax", async t => {
    const rendered = await je.render("include-title-bind", { title: "nested" });
    t.is(rendered, "<h1>nested</h1>");
});

test("should handle deep binds", async t => {
    const rendered = await je.render("include-title-deep-bind", { book: { title: "Bookshop" } });
    t.is(rendered, "<h1>Bookshop</h1>");
});

test("should render bookshop_includes", async t => {
    const rendered = await je.render("uses-helper", { label: "include-testing" });
    t.is(rendered, "<span data-helper=\"include-testing\"></span>");
});
