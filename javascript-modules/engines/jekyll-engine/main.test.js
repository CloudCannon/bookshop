import test from 'ava';
import { Engine } from './main.js';

const files = {
    "title-include": "<h1>{{ include.title }}</h1>",
    "title-global": "<h1>{{ title }}</h1>"
}

const je = new Engine({files});

test("basic rendering", async t => {
    const rendered = await je.render("{{ include.title }}", { title: "test" });
    t.is(rendered, "test");
});

test("should render an include", async t => {
    const rendered = await je.render(`{% include title-include title="Hello World" %}`);
    t.is(rendered, "<h1>Hello World</h1>");
});

test("should not pass through unscoped props", async t => {
    const rendered = await je.render(`{% include title-global title="Hello World" %}`);
    t.is(rendered, "<h1></h1>");
});

test("should pass through global data", async t => {
    const rendered = await je.render(`{% include title-global %}`, {}, { title: "test" });
    t.is(rendered, "<h1>test</h1>");
});

test("should implement bind syntax", async t => {
    const rendered = await je.render(`{% include title-include bind=include %}`, { title: "nested" });
    t.is(rendered, "<h1>nested</h1>");
});

test("should handle deep binds", async t => {
    const rendered = await je.render(`{% include title-include bind=include.book %}`, { book: { title: "Bookshop" } });
    t.is(rendered, "<h1>Bookshop</h1>");
});
