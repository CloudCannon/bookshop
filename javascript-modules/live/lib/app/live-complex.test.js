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

const eleventyComponent = (k) => `components/${k}/${k}.eleventy.liquid`;
const eleventyFiles = {
    [eleventyComponent('wrapper')]: "<div class='wrap'>{% bookshop '{{component}}' bind: data %}</div>",
    [eleventyComponent('tag')]: `<span class="u-tag">{{ text }}</span>`,
    [eleventyComponent('page')]: `<div class="page">{% bookshop "hero" tags: tags %}</div>`,
    [eleventyComponent('hero')]: `<div class="c-title">{% for tag in tags %}{% bookshop "tag" bind: tag %}{% endfor %}</div>`
}

const initial = async (liveInstance, component, props) => {
    await liveInstance.engines[0].render(
        document.querySelector('body'),
        component,
        props
    );
}

const initialSub = async (liveInstance, component, props, wrapper = 'wrapper') => {
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
        eleventy: new (getLive([new EleventyEngine({ files: eleventyFiles })]))()
    };
})

for (const impl of ['eleventy']) {
    test.serial(`[${impl}]: Double nested forloop`, async t => {
        await initialSub(t.context[impl], 'page', {
            data: {
                tags: [{ text: 'bookshop' }, { text: 'eleventy' }]
            }
        });
        t.regex(getBody(), /<span class="u-tag">eleventy<\/span>/);


        await t.context[impl].update({
            data: {
                tags: [{ text: 'bookshop' }, { text: 'eleventy-re' }]
            }
        }, { editorLinks: true })
        t.regex(getBody(), /eleventy-re/);


        let trigger = false;
        document.querySelector('.c-title').addEventListener('click', () => trigger = true);

        await t.context[impl].update({
            data: {
                tags: [{ text: 'bookshop' }, { text: 'eleventy-bloop' }]
            }
        }, { editorLinks: true })
        t.regex(getBody(), /eleventy-bloop/);

        t.is(trigger, false);
        document.querySelector('.c-title').click();
        t.is(trigger, true);
    });
}
