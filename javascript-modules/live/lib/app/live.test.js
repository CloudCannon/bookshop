import test from 'ava';
import { JSDOM } from 'jsdom';
import { getLive } from './live.js';
import { Engine as JekyllEngine } from '@bookshop/jekyll-engine';
import { Engine as EleventyEngine } from '@bookshop/eleventy-engine';

// Selectively expose the few globals we need for testing
const jsdomWindow = (new JSDOM(`...`)).window;
['document', 'XPathResult', 'Node'].forEach(prop => {
    Object.defineProperty(global, prop, {
        configurable: true,
        get: () => jsdomWindow[prop]
    });
});

const jekyllComponent = (k) => `components/${k}/${k}.jekyll.html`;
const jekyllShared = (k) => `shared/jekyll/${k}.jekyll.html`;
const jekyllFiles = {
    [jekyllComponent('title')]: "<h1>{{ include.title }}</h1>",
    [jekyllComponent('null')]: "<null>empty</null>",
    [jekyllComponent('super-title')]: "{% bookshop title title=include.one %}<h1>{{ include.two }}</h2>{% bookshop title title=include.three %}",
    [jekyllComponent('super-wrapped-title-inner')]: "<div>{% bookshop title title=include.one %}</div><h1>{{ include.two }}</h2><div>{% bookshop title title=include.three %}</div>",
    [jekyllComponent('super-wrapped-title')]: "<div>{% bookshop super-wrapped-title-inner bind=include.inner %}</div>",
    [jekyllShared('title-loop')]: "{% for t in include.titles %}{% bookshop title title=t %}{% endfor %}",
    [jekyllComponent('num-loop')]: "{% for t in (include.min..include.max) %}{% bookshop title title=t %}{% endfor %}",
    [jekyllComponent('wrapper')]: "{% bookshop {{include.component}} bind=page.data %}",
    [jekyllComponent('include-wrapper')]: "{% bookshop_include {{include.component}} bind=page.data %}",
    [jekyllComponent('title-wrapper')]: "{% bookshop {{include.component}} title=page.title %}",
    [jekyllComponent('titles-wrapper')]: "{% bookshop_include {{include.component}} titles=page.titles %}",
    [jekyllComponent('titles-wrapper-erroneous-component')]: "{% bookshop_include {{include.component}} titles=page.titles %}{% bookshop null null=t %}",
    [jekyllComponent('assign-wrapper')]: "{% assign test_var=include.component %}{% bookshop {{test_var}} bind=page %}",
    [jekyllComponent('dynamic-loop')]: "{% for props in include.t %}{% bookshop {{props._bookshop_name}} bind=props %}{% endfor %}",
}

const eleventyComponent = (k) => `components/${k}/${k}.eleventy.liquid`;
const eleventyShared = (k) => `shared/eleventy/${k}.eleventy.liquid`;
const eleventyFiles = {
    [eleventyComponent('title')]: "<h1>{{ title }}</h1>",
    [eleventyComponent('null')]: "<null>empty</null>",
    [eleventyComponent('super-title')]: "{% bookshop 'title' title: one %}<h1>{{ two }}</h2>{% bookshop 'title' title: three %}",
    [eleventyComponent('super-wrapped-title-inner')]: "<div>{% bookshop 'title' title: one %}</div><h1>{{ two }}</h2><div>{% bookshop 'title' title: three %}</div>",
    [eleventyComponent('super-wrapped-title')]: "<div>{% bookshop 'super-wrapped-title-inner' bind: inner %}</div>",
    [eleventyShared('title-loop')]: "{% for t in titles %}{% bookshop 'title' title: t %}{% endfor %}",
    [eleventyComponent('num-loop')]: "{% for t in (min..max) %}{% bookshop 'title' title: t %}{% endfor %}",
    [eleventyComponent('wrapper')]: "{% bookshop '{{component}}' bind: data %}",
    [eleventyComponent('include-wrapper')]: "{% bookshop_include '{{component}}' bind: data %}",
    [eleventyComponent('title-wrapper')]: "{% bookshop '{{component}}' title: title %}",
    [eleventyComponent('titles-wrapper')]: "{% bookshop_include '{{component}}' titles: titles %}",
    [eleventyComponent('titles-wrapper-erroneous-component')]: "{% bookshop_include '{{component}}' titles: titles %}{% bookshop 'null' null: t %}",
    [eleventyComponent('assign-wrapper')]: "{% assign test_var=component %}{% bookshop '{{test_var}}' bind: page %}",
    [eleventyComponent('dynamic-loop')]: "{% for props in t %}{% bookshop {{props._bookshop_name}} bind: props %}{% endfor %}",
}

const wrapDataFor = (impl, data) => {
    if (impl === 'jekyll') return { page: data };
    return data;
}

const initial = async (liveInstance, component, props) => {
    await liveInstance.engines[0].render(
        document.querySelector('body'),
        component,
        props
    );
}

const initialSub = async (liveInstance, component, props, wrapper = 'wrapper') => {
    if (liveInstance.engines[0].name === 'Jekyll') {
        props = { page: props };
    }
    await liveInstance.engines[0].render(
        document.querySelector('body'),
        wrapper,
        { component },
        props
    );
}

const getBody = () => document.querySelector('body').innerHTML;
const setBody = (h) => document.querySelector('body').innerHTML = Array.isArray(h) ? h.join('') : h;

test.beforeEach(async t => {
    setBody('');
    t.context = {
        jekyll: new (getLive([new JekyllEngine({ files: jekyllFiles })]))(),
        eleventy: new (getLive([new EleventyEngine({ files: eleventyFiles })]))()
    };
})

for (const impl of ['jekyll', 'eleventy']) {
    test.serial(`[${impl}]: Re-renders a simple component`, async t => {
        await initialSub(t.context[impl], 'title', { data: { title: 'Bookshop' } });
        const pagedot = impl === `jekyll` ? `page.` : ``;
        t.is(getBody(), [
            `<!--bookshop-live name(title) params(bind: ${pagedot}data)-->`,
            `<h1>Bookshop<\/h1>`,
            `<!--bookshop-live end-->`
        ].join(''));

        const data = wrapDataFor(impl, { data: { title: 'Live Love Laugh' } });
        await t.context[impl].update(data, { editorLinks: false })
        t.is(getBody(), [
            `<!--bookshop-live name(title) params(bind: ${pagedot}data)-->`,
            `<h1>Live Love Laugh<\/h1>`,
            `<!--bookshop-live end-->`
        ].join(''));
    });

    test.serial(`[${impl}]: Re-renders in a loop`, async t => {
        await initialSub(t.context[impl], 'title-loop', { data: { titles: ['Bookshop', 'Jekyll', 'Eleventy'] } }, 'include-wrapper');
        t.regex(getBody(), /<h1>Jekyll<\/h1>/);

        let trigger = false;
        // Add event listener to the first h1 'Bookshop'
        document.querySelectorAll('h1')[0].addEventListener('click', () => trigger = true);

        const data = wrapDataFor(impl, { data: { titles: ['Bookshop', 'Hugo', 'Eleventy'] } });
        await t.context[impl].update(data, { editorLinks: false })
        t.regex(getBody(), /<h1>Hugo<\/h1>/);
        t.notRegex(getBody(), /<h1>Jekyll<\/h1>/);

        // Check that the page was only partially rendered
        // By clicking the first h1 that should have been
        // left untouched.
        t.is(trigger, false);
        document.querySelectorAll('h1')[0].click();
        t.is(trigger, true);
    });

    test.serial(`[${impl}]: Re-renders through an assign`, async t => {
        await initialSub(t.context[impl], 'title', { title: 'Bookshop' }, 'assign-wrapper');
        const val = (impl === 'jekyll') ? 'include.component' : 'component';
        t.is(getBody(), [
            `<!--bookshop-live context(test_var: (${val}))-->`,
            `<!--bookshop-live name(title) params(bind: page)-->`,
            `<h1>Bookshop<\/h1>`,
            `<!--bookshop-live end-->`
        ].join(''));

        await t.context[impl].update({ page: { title: 'Live Love Laugh' } })
        t.is(getBody(), [
            `<!--bookshop-live context(test_var: (${val}))-->`,
            `<!--bookshop-live name(title) params(bind: page)-->`,
            `<h1>Live Love Laugh<\/h1>`,
            `<!--bookshop-live end-->`
        ].join(''));
    });

    test.serial(`[${impl}]: Re-renders top-level loop`, async t => {
        await initial(t.context[impl], 'title-loop', { titles: ['Bookshop', 'Jekyll', 'Eleventy'] });
        t.regex(getBody(), /<h1>Jekyll<\/h1>/);

        await t.context[impl].update({ titles: ['Bookshop', 'Hugo', 'Eleventy'] }, { editorLinks: false, transformData: false })
        t.regex(getBody(), /<h1>Hugo<\/h1>/);
        t.notRegex(getBody(), /<h1>Jekyll<\/h1>/);
    });

    test.serial(`[${impl}]: Re-renders range loop`, async t => {
        await initial(t.context[impl], 'num-loop', { min: 0, max: 1 });
        t.regex(getBody(), /<h1>0<\/h1>.*<h1>1<\/h1>/);
        t.notRegex(getBody(), /<h1>2<\/h1>/);

        await t.context[impl].update({ min: 4, max: 5 }, { editorLinks: false, transformData: false });
        t.regex(getBody(), /<h1>4<\/h1>.*<h1>5<\/h1>/);
        t.notRegex(getBody(), /<h1>0<\/h1>/);
    });

    test.serial(`[${impl}]: Re-renders dynamic loop`, async t => {
        await initial(t.context[impl], 'dynamic-loop', {
            t: [
                {
                    _bookshop_name: 'title',
                    title: 'Outer Hello World'
                },
                {
                    _bookshop_name: 'dynamic-loop',
                    t: [
                        {
                            _bookshop_name: 'title',
                            title: 'First Inner Hello World'
                        },
                        {
                            _bookshop_name: 'title',
                            title: 'Second Inner Hello World'
                        }
                    ]
                }
            ]
        });
        t.regex(getBody(), /<h1>Outer Hello World<\/h1>/);
        t.regex(getBody(), /<h1>First Inner Hello World<\/h1>/);
        t.regex(getBody(), /<h1>Second Inner Hello World<\/h1>/);

        await t.context[impl].update({
            t: [
                {
                    _bookshop_name: 'title',
                    title: 'Outer Hello World'
                },
                {
                    _bookshop_name: 'dynamic-loop',
                    t: [
                        {
                            _bookshop_name: 'title',
                            title: 'First Changed Inner Hello World'
                        },
                        {
                            _bookshop_name: 'title',
                            title: 'Second Inner Hello World'
                        },
                        {
                            _bookshop_name: 'title',
                            title: 'Third Inner Hello World'
                        }
                    ]
                }
            ]
        }, { editorLinks: false, transformData: false })
        t.regex(getBody(), /<h1>First Changed Inner Hello World<\/h1>/);
        t.notRegex(getBody(), /<h1>First Inner Hello World<\/h1>/);
        t.regex(getBody(), /<h1>Third Inner Hello World<\/h1>/);
    });

    test.serial(`[${impl}]: Re-renders depth first`, async t => {
        await initialSub(t.context[impl], 'super-title', { data: { one: "One", two: "Two", three: "Three" } });
        t.regex(getBody(), /<h1>One<\/h1>/);

        let trigger = false;
        // Add event listener to h1 not rendered from a subcomponent 'Two'
        document.querySelectorAll('h1')[1].addEventListener('click', () => trigger = true);

        const data = wrapDataFor(impl, { data: { one: "Uno", two: "Two", three: "Tres" } });
        await t.context[impl].update(data, { editorLinks: false })
        t.regex(getBody(), /<h1>Uno<\/h1>/);
        t.regex(getBody(), /<h1>Two<\/h1>/);
        t.regex(getBody(), /<h1>Tres<\/h1>/);
        t.notRegex(getBody(), /<h1>One<\/h1>/);
        t.notRegex(getBody(), /<h1>Three<\/h1>/);

        // Check that the page was only partially rendered
        // By clicking the h1 that should have been
        // left untouched.
        t.is(trigger, false);
        document.querySelectorAll('h1')[1].click();
        t.is(trigger, true);
    });

    test.serial(`[${impl}]: Renders a simple editor link`, async t => {
        await initialSub(t.context[impl], 'title', { title: 'Bookshop' }, 'title-wrapper');

        const data = wrapDataFor(impl, { title: 'Live Love Laugh' });
        await t.context[impl].update(data, { editorLinks: true });
        const pagedot = impl === `jekyll` ? `page.` : ``;
        t.is(getBody(), [
            `<!--bookshop-live name(title) params(title: ${pagedot}title)-->`,
            `<h1 data-cms-bind="#title">Live Love Laugh<\/h1>`,
            `<!--bookshop-live end-->`
        ].join(''));
    });

    test.serial(`[${impl}]: Parent editor links overrule child editor links`, async t => {
        await initialSub(t.context[impl], 'super-title', { data: { one: "One", two: "Two", three: "Three" } });

        const data = wrapDataFor(impl, { data: { one: "One", two: "Two", three: "Three" } });
        await t.context[impl].update(data)
        t.regex(getBody(), /<h1 data-cms-bind="#data">One<\/h1>/);
        t.regex(getBody(), /<h1 data-cms-bind="#data">Two<\/h1>/);
        t.regex(getBody(), /<h1 data-cms-bind="#data">Three<\/h1>/);
    });

    test.serial(`[${impl}]: Renders nested editor links`, async t => {
        await initialSub(t.context[impl], 'title-loop', { titles: ['Bookshop', 'Jekyll', 'Eleventy'] }, 'titles-wrapper');

        const data = wrapDataFor(impl, { titles: ['Bookshop', 'Jekyll', 'Eleventy'] });
        await t.context[impl].update(data)
        t.regex(getBody(), /<h1 data-cms-bind="#titles.0">Bookshop<\/h1>/);
        t.regex(getBody(), /<h1 data-cms-bind="#titles.1">Jekyll<\/h1>/);
        t.regex(getBody(), /<h1 data-cms-bind="#titles.2">Eleventy<\/h1>/);
    });

    test.serial(`[${impl}]: Cleans up paths for editor links when going out of scope`, async t => {
        await initialSub(t.context[impl], 'title-loop', { titles: ['Bookshop', 'Jekyll', 'Eleventy'] }, 'titles-wrapper-erroneous-component');

        const data = wrapDataFor(impl, { titles: ['Bookshop', 'Jekyll', 'Eleventy'] });
        await t.context[impl].update(data, { editorLinks: true })
        t.regex(getBody(), /<h1 data-cms-bind="#titles.0">Bookshop<\/h1>/);
        t.notRegex(getBody(), /<null data-cms-bind/);
    });

    test.serial(`[${impl}]: Re-renders editor links depth first`, async t => {
        // TODO: This test fails with the structure {data: data: { ... }}
        // as inner components resolve data.data.data instead of data.data
        await initialSub(t.context[impl], 'super-wrapped-title', { data: { inner: { one: "One", two: "Two", three: "Three" } } });

        // Trigger an initial render, since the engine render above won't contain editor links
        // (and thus everything gets refreshed)
        let data = wrapDataFor(impl, { data: { inner: { one: "One", two: "Two", three: "Three" } } });
        await t.context[impl].update(data, { editorLinks: true })

        let trigger = false;
        // Add event listener to h1 not rendered from a subcomponent 'Two'
        document.querySelectorAll('h1')[1].addEventListener('click', () => trigger = true);

        // Re-render with new data that should only affect the subcomponents, 
        // not the super-title component itself.
        data = wrapDataFor(impl, { data: { inner: { one: "Uno", two: "Two", three: "Tres" } } });
        await t.context[impl].update(data, { editorLinks: true })
        t.regex(getBody(), /Uno/);

        // Check that the page was only partially rendered
        // By clicking the h1 that should have been
        // left untouched.
        t.is(trigger, false);
        document.querySelectorAll('h1')[1].click();
        t.is(trigger, true);
    });

    test.serial(`[${impl}]: Respects the editorLinks flag`, async t => {
        await initialSub(t.context[impl], 'super-wrapped-title', { data: { editorLink: false, inner: { one: "One", two: "Two", three: "Three" } } });

        // Render without the outer-most editor link
        let data = wrapDataFor(impl, { data: { editorLink: false, inner: { one: "One", two: "Two", three: "Three" } } });
        await t.context[impl].update(data, { editorLinks: true })

        t.notRegex(getBody(), /<div data-cms-bind="#data">/);
        t.regex(getBody(), /<div data-cms-bind="#data.inner">/);

        // Render without the inner editor link
        data = wrapDataFor(impl, { data: { editorLink: true, inner: { editorLink: false, one: "One", two: "Two", three: "Three" } } });
        await t.context[impl].update(data, { editorLinks: true })

        t.regex(getBody(), /<div data-cms-bind="#data">/);
        t.notRegex(getBody(), /<div data-cms-bind="#data.inner">/);

        // Render with both editor links
        data = wrapDataFor(impl, { data: { inner: { one: "One", two: "Two", three: "Three" } } });
        await t.context[impl].update(data, { editorLinks: true })

        t.regex(getBody(), /<div data-cms-bind="#data">/);
        t.regex(getBody(), /<div data-cms-bind="#data.inner">/);

        // Render without the inner editor link using the other syntax
        data = wrapDataFor(impl, { data: { editor_link: true, inner: { editor_link: false, one: "One", two: "Two", three: "Three" } } });
        await t.context[impl].update(data, { editorLinks: true })

        t.regex(getBody(), /<div data-cms-bind="#data">/);
        t.notRegex(getBody(), /<div data-cms-bind="#data.inner">/);
    });
}
