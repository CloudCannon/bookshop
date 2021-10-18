import test from 'ava';
import { Liquid } from 'liquidjs';
import { liquidHighlight } from './highlight.js';

test("should escape HTML", async t => {
    const liquid = new Liquid({});
    liquid.plugin(liquidHighlight);

    const result = await liquid.parseAndRender(`
        {%- highlight -%}
            <h1>Hello World</h1>
        {%- endhighlight -%}
    `);
    t.notRegex(result, /<h1>Hello World<\/h1>/);
    t.regex(result, /&lt;h1&gt;/);
});

test("should evaluate inner liquid", async t => {
    const liquid = new Liquid({});
    liquid.plugin(liquidHighlight);

    const result = await liquid.parseAndRender(`
        {%- highlight -%}
            <h1>Hello {{ test }}</h1>
        {%- endhighlight -%}
    `, {test: "Bookshop"});
    t.regex(result, /&lt;h1&gt;Hello Bookshop&lt;\/h1&gt;/);
});

test("should respect raw tags", async t => {
    const liquid = new Liquid({});
    liquid.plugin(liquidHighlight);

    const result = await liquid.parseAndRender(`
        {%- highlight -%}
            {% raw %}<h1>Hello {{ test }}</h1>{% endraw %}
        {%- endhighlight -%}
    `, {test: "Bookshop"});
    t.regex(result, /&lt;h1&gt;Hello {{ test }}&lt;\/h1&gt;/);
});

test("should handle no language", async t => {
    const liquid = new Liquid({});
    liquid.plugin(liquidHighlight);

    const result = await liquid.parseAndRender(`{% highlight %}{% endhighlight %}`);
    t.regex(result, /<code>/);
});

test("should handle language", async t => {
    const liquid = new Liquid({});
    liquid.plugin(liquidHighlight);

    const result = await liquid.parseAndRender(`{% highlight ruby %}{% endhighlight %}`);
    t.regex(result, /<code class="language-ruby" data-lang="ruby">/);
});