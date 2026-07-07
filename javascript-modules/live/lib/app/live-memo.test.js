import test from 'ava';
import { JSDOM } from 'jsdom';
import { getLive } from './live.js';
import { Engine as JekyllEngine } from '@bookshop/jekyll-engine';

// Selectively expose the few globals we need for testing
const jsdomWindow = (new JSDOM(`...`)).window;
['document', 'XPathResult', 'Node'].forEach(prop => {
    Object.defineProperty(global, prop, {
        configurable: true,
        get: () => jsdomWindow[prop]
    });
});

const jekyllComponent = (k) => `components/${k}/${k}.jekyll.html`;
const jekyllFiles = {
    [jekyllComponent('title')]: "<h1>{{ include.title }}</h1>",
    [jekyllComponent('empty')]: "{% if include.never %}never rendered{% endif %}",
    [jekyllComponent('wrapper')]: "{% bookshop {{include.component}} bind=page.data %}",
}

const getBody = () => document.querySelector('body').innerHTML;
const setBody = (h) => document.querySelector('body').innerHTML = Array.isArray(h) ? h.join('') : h;

// Renders the wrapper into the body and returns a live instance with
// memoization active (the engine advertises a dataGeneration) and a spy
// counting how many component renders the live layer requests.
const setupLive = async (component, data) => {
    setBody('');
    const live = new (getLive([new JekyllEngine({ files: jekyllFiles })]))();
    live.renderFrequency = 0;

    const engine = live.engines[0];
    // Memoized component skipping is only enabled for engines that track a
    // data generation (currently the Hugo engine); simulate that here.
    engine.dataGeneration = 0;

    await engine.render(
        document.querySelector('body'),
        'wrapper',
        { component },
        { page: { data } }
    );

    live.renderCalls = 0;
    const originalRender = engine.render.bind(engine);
    engine.render = (...args) => {
        live.renderCalls += 1;
        return originalRender(...args);
    };

    return live;
}

test.serial("re-renders a component when its data changes", async t => {
    const live = await setupLive('title', { title: 'One' });

    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 1);
    t.regex(getBody(), /<h1[^>]*>One<\/h1>/);

    await live.update({ page: { data: { title: 'Two' } } });
    t.is(live.renderCalls, 2);
    t.regex(getBody(), /<h1[^>]*>Two<\/h1>/);

    // Changing back is also a change
    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 3);
    t.regex(getBody(), /<h1[^>]*>One<\/h1>/);
});

test.serial("skips re-rendering a component with unchanged inputs", async t => {
    const live = await setupLive('title', { title: 'One' });

    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 1);

    await live.update({ page: { data: { title: 'One' } } });
    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 1);
    t.regex(getBody(), /<h1[^>]*>One<\/h1>/);
});

test.serial("skips re-rendering a component with legitimately empty output", async t => {
    const live = await setupLive('empty', { title: 'One' });

    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 1);

    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 1);
    t.regex(getBody(), /bookshop-live end/);
});

test.serial("re-renders unchanged components when the engine data generation changes", async t => {
    const live = await setupLive('title', { title: 'One' });

    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 1);

    // Site data/config/templates changed underneath the component
    live.engines[0].dataGeneration += 1;
    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 2);
});

test.serial("re-renders unchanged components when global data changes", async t => {
    const live = await setupLive('title', { title: 'One' });

    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 1);

    live.globalDataVersion += 1;
    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 2);
});

test.serial("does not remember failed renders", async t => {
    const live = await setupLive('title', { title: 'One' });

    // A render the engine reports as failed shouldn't be memoized,
    // so the next update with the same inputs retries it.
    const originalRenderElements = live.renderElements.bind(live);
    let failNext = true;
    live.renderElements = async (components, logger) => {
        await originalRenderElements(components, logger);
        if (failNext) {
            components.forEach(c => { c.renderedOk = false; });
            failNext = false;
        }
    };

    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 1);

    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 2);

    // The successful retry is remembered as usual
    await live.update({ page: { data: { title: 'One' } } });
    t.is(live.renderCalls, 2);
});

test.serial("window.bookshopLiveNoMemo disables memoization", async t => {
    const live = await setupLive('title', { title: 'One' });

    Object.defineProperty(global, 'window', {
        configurable: true,
        value: { bookshopLiveNoMemo: true }
    });
    try {
        await live.update({ page: { data: { title: 'One' } } });
        await live.update({ page: { data: { title: 'One' } } });
        t.is(live.renderCalls, 2);
    } finally {
        delete global.window;
    }
});
