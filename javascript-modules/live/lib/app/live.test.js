import test from 'ava';
import browserEnv from 'browser-env';
import { getLive } from './live.js';
import { Engine as JekyllEngine } from '@bookshop/jekyll-engine';
import { Engine as EleventyEngine } from '@bookshop/eleventy-engine';

browserEnv();

const jekyllComponent = (k) => `components/${k}/${k}.jekyll.html`;
const jekyllFiles = {
    [jekyllComponent('title')]: "<h1>{{ include.title }}</h1>",
    [jekyllComponent('super-title')]: "{% bookshop title title=include.one %}<h1>{{ include.two }}</h2>{% bookshop title title=include.three %}",
    [jekyllComponent('title-loop')]: "{% for t in include.titles %}{% bookshop title title=t %}{% endfor %}",
    [jekyllComponent('num-loop')]: "{% for t in (include.min..include.max) %}{% bookshop title title=t %}{% endfor %}",
    [jekyllComponent('wrapper')]: "{% bookshop {{include.component}} bind=page %}",
}

const eleventyComponent = (k) => `components/${k}/${k}.eleventy.liquid`;
const eleventyFiles = {
    [eleventyComponent('title')]: "<h1>{{ title }}</h1>",
    [eleventyComponent('super-title')]: "{% bookshop 'title' title: one %}<h1>{{ two }}</h2>{% bookshop 'title' title: three %}",
    [eleventyComponent('title-loop')]: "{% for t in titles %}{% bookshop 'title' title: t %}{% endfor %}",
    [eleventyComponent('num-loop')]: "{% for t in (min..max) %}{% bookshop 'title' title: t %}{% endfor %}",
    [eleventyComponent('wrapper')]: "{% bookshop '{{component}}' bind: page %}",
}

const initial = async (liveInstance, component, props) => {
    await liveInstance.engines[0].render(
        document.querySelector('body'),
        component,
        props
    );
}

const initialSub = async (liveInstance, component, props) => {
    await liveInstance.engines[0].render(
        document.querySelector('body'),
        'wrapper',
        {component},
        {page: props}
    );
}

const getBody = () => document.querySelector('body').innerHTML;
const setBody = (h) => document.querySelector('body').innerHTML = Array.isArray(h) ? h.join('') : h;

test.beforeEach(async t => {
    setBody('');
    t.context = {
        jekyll: new (getLive([new JekyllEngine({files: jekyllFiles})]))(),
        eleventy: new (getLive([new EleventyEngine({files: eleventyFiles})]))()
    };
})

for (const impl of ['jekyll', 'eleventy']) {
    test.serial(`[${impl}]: Re-renders a simple component`, async t => {
        await initialSub(t.context[impl], 'title', {title: 'Bookshop'});
        t.is(getBody(), [
            `<!--bookshop-live name(title) params(bind: page)-->`,
            `<h1>Bookshop<\/h1>`,
            `<!--bookshop-live end-->`
        ].join(''));

        await t.context[impl].update({page: {title: 'Live Love Laugh'}})
        t.is(getBody(), [
            `<!--bookshop-live name(title) params(bind: page)-->`,
            `<h1>Live Love Laugh<\/h1>`,
            `<!--bookshop-live end-->`
        ].join(''));
    });

    test.serial(`[${impl}]: Re-renders in a loop`, async t => {
        await initialSub(t.context[impl], 'title-loop', {titles: ['Bookshop', 'Jekyll', 'Eleventy']});
        t.regex(getBody(), /<h1>Jekyll<\/h1>/);

        let trigger = false;
        // Add event listener to the first h1 'Bookshop'
        document.querySelectorAll('h1')[0].addEventListener('click', () => trigger = true);

        await t.context[impl].update({page: {titles: ['Bookshop', 'Hugo', 'Eleventy']}})
        t.regex(getBody(), /<h1>Hugo<\/h1>/);
        t.notRegex(getBody(), /<h1>Jekyll<\/h1>/);

        // Check that the page was only partially rendered
        // By clicking the first h1 that should have been
        // left untouched.
        t.is(trigger, false);
        document.querySelectorAll('h1')[0].click();
        t.is(trigger, true);
    });

    test.serial(`[${impl}]: Re-renders top-level loop`, async t => {
        await initial(t.context[impl], 'title-loop', {titles: ['Bookshop', 'Jekyll', 'Eleventy']});
        t.regex(getBody(), /<h1>Jekyll<\/h1>/);

        await t.context[impl].update({titles: ['Bookshop', 'Hugo', 'Eleventy']})
        t.regex(getBody(), /<h1>Hugo<\/h1>/);
        t.notRegex(getBody(), /<h1>Jekyll<\/h1>/);
    });

    test.serial(`[${impl}]: Re-renders range loop`, async t => {
        await initial(t.context[impl], 'num-loop', {min: 0, max: 1});
        t.regex(getBody(), /<h1>0<\/h1>.*<h1>1<\/h1>/);
        t.notRegex(getBody(), /<h1>2<\/h1>/);

        await t.context[impl].update({min: 4, max: 5});
        t.regex(getBody(), /<h1>4<\/h1>.*<h1>5<\/h1>/);
        t.notRegex(getBody(), /<h1>0<\/h1>/);
    });

    test.serial(`[${impl}]: Re-renders depth first`, async t => {
        await initialSub(t.context[impl], 'super-title', {one: "One", two: "Two", three: "Three"});
        t.regex(getBody(), /<h1>One<\/h1>/);

        let trigger = false;
        // Add event listener to h1 not rendered from a subcomponent 'Two'
        document.querySelectorAll('h1')[1].addEventListener('click', () => trigger = true);

        await t.context[impl].update({page: {one: "Uno", two: "Two", three: "Tres"}})
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
}