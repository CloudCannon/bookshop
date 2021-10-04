import test from 'ava';
import { Engine } from './main.js';

const component = (k) => `components/${k}/${k}.eleventy.liquid`;
const shared = (k) => `shared/eleventy/${k}.eleventy.liquid`;
const files = {
    [component('title')]: "<h1>{{ title }}</h1>",
    [component('include-title')]: "{% bookshop \"title\" title: \"Hello World\" %}",
    [component('include-title-bind')]: "{% bookshop \"title\" %}",
    [component('include-title-deep-bind')]: "{% bookshop \"title\" bind: book %}",
    [component('uses-helper')]: "{% bookshop_include \"helper\" help: label %}",
    [shared('helper')]: "<span data-helper=\"{{help}}\"></span>",
}
const livePost = `<!--bookshop-live end-->`

const eleventyEngine = new Engine({files});

test("should find components", async t => {
    t.is(eleventyEngine.hasComponent('title'), true);
});

test("should not find components", async t => {
    t.is(eleventyEngine.hasComponent('subtitle'), false);
});

test("basic rendering", async t => {
    const targetElementStub = {};
    await eleventyEngine.render(targetElementStub, "title", { title: "test" });
    t.is(targetElementStub.innerHTML, `<h1>test</h1>`);
});

test("should render a subcomponent", async t => {
    const targetElementStub = {};
    await eleventyEngine.render(targetElementStub, "include-title");
    const livePre = `<!--bookshop-live name(title) params(title: "Hello World")-->`
    t.is(targetElementStub.innerHTML, `${livePre}<h1>Hello World</h1>${livePost}`);
});

test("should pass through global data", async t => {
    const targetElementStub = {};
    await eleventyEngine.render(targetElementStub, "title", {}, { title: "test" });
    t.is(targetElementStub.innerHTML, `<h1>test</h1>`);
});

test("should implement bind syntax", async t => {
    const targetElementStub = {};
    await eleventyEngine.render(targetElementStub, "include-title-deep-bind", { book: { title: "Bookshop" } });
    const livePre = `<!--bookshop-live name(title) params(bind: book)-->`
    t.is(targetElementStub.innerHTML, `${livePre}<h1>Bookshop</h1>${livePost}`);
});

test("should render bookshop_includes", async t => {
    const targetElementStub = {};
    await eleventyEngine.render(targetElementStub, "uses-helper", { label: "include-testing" });
    const livePre = `<!--bookshop-live name(helper) params(help: label)-->`
    t.is(targetElementStub.innerHTML, `${livePre}<span data-helper=\"include-testing\"></span>${livePost}`);
});
