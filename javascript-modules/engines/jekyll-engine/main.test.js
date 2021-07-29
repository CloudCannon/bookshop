import { Engine } from './main.js';

const files = {
    "title-include": "<h1>{{ include.title }}</h1>",
    "title-global": "<h1>{{ title }}</h1>"
}

const je = new Engine({files});

test("basic rendering", async () => {
    const rendered = await je.render("{{ include.title }}", { title: "test" });
    expect(rendered).toBe("test");
});

test("should render an include", async () => {
    const rendered = await je.render(`{% include title-include title="Hello World" %}`);
    expect(rendered).toBe("<h1>Hello World</h1>");
});

test("should not pass through unscoped props", async () => {
    const rendered = await je.render(`{% include title-global title="Hello World" %}`);
    expect(rendered).toBe("<h1></h1>");
});

test("should pass through global data", async () => {
    const rendered = await je.render(`{% include title-global %}`, {}, { title: "test" });
    expect(rendered).toBe("<h1>test</h1>");
});

test("should implement bind syntax", async () => {
    const rendered = await je.render(`{% include title-include bind=include %}`, { title: "nested" });
    expect(rendered).toBe("<h1>nested</h1>");
});

test("should handle deep binds", async () => {
    const rendered = await je.render(`{% include title-include bind=include.book %}`, { book: { title: "Bookshop" } });
    expect(rendered).toBe("<h1>Bookshop</h1>");
});
