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
    [shared('highlight')]: "{% highlight %}<{% endhighlight %}",
}
const livePost = `<!--bookshop-live end-->`

const je = new Engine({files});

test("should find components", async t => {
    t.is(je.hasComponent('title'), true);
});

test("should not find components", async t => {
    t.is(je.hasComponent('subtitle'), false);
});

test("basic rendering", async t => {
    const targetElementStub = {};
    await je.render(targetElementStub, "title", { title: "test" });
    t.is(targetElementStub.innerHTML, `<h1>test</h1>`);
});

test("should render an include", async t => {
    const targetElementStub = {};
    await je.render(targetElementStub, "include-title");
    const livePre = `<!--bookshop-live name(title) params(title: "Hello World")-->`
    t.is(targetElementStub.innerHTML, `${livePre}<h1>Hello World</h1>${livePost}`);
});

test("should not pass through unscoped props", async t => {
    const targetElementStub = {};
    await je.render(targetElementStub, "include-global-title");
    const livePre = `<!--bookshop-live name(global-title) params(title: "Hello World")-->`
    t.is(targetElementStub.innerHTML, `${livePre}<h1></h1>${livePost}`);
});

test("should pass through global data", async t => {
    const targetElementStub = {};
    await je.render(targetElementStub, "include-global-title", {}, { title: "test" });
    const livePre = `<!--bookshop-live name(global-title) params(title: "Hello World")-->`
    t.is(targetElementStub.innerHTML, `${livePre}<h1>test</h1>${livePost}`);
});

test("should implement bind syntax", async t => {
    const targetElementStub = {};
    await je.render(targetElementStub, "include-title-bind", { title: "nested" });
    const livePre = `<!--bookshop-live name(title) params(bind: include)-->`
    t.is(targetElementStub.innerHTML, `${livePre}<h1>nested</h1>${livePost}`);
});

test("should handle deep binds", async t => {
    const targetElementStub = {};
    await je.render(targetElementStub, "include-title-deep-bind", { book: { title: "Bookshop" } });
    const livePre = `<!--bookshop-live name(title) params(bind: book)-->`
    t.is(targetElementStub.innerHTML, `${livePre}<h1>Bookshop</h1>${livePost}`);
});

test("should render bookshop_includes", async t => {
    const targetElementStub = {};
    await je.render(targetElementStub, "uses-helper", { label: "include-testing" });
    const livePre = `<!--bookshop-live name(helper) params(help: label)-->`
    t.is(targetElementStub.innerHTML, `${livePre}<span data-helper=\"include-testing\"></span>${livePost}`);
});

test("should support highlight tag", async t => {
    const targetElementStub = {};
    await je.render(targetElementStub, "highlight");
    t.regex(targetElementStub.innerHTML, /&lt;/);
});
