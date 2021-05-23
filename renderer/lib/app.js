import bookshopComponents from `components`;
import bookshopStyles from `components.bookshop_scss`;
import Polymorph from './polymorph.svelte';

console.log('Bookshop polymorph initialising.');

const componentMap = {
    ".jekyll.html": "jekyll",
    ".svelte": "svelte",
    ".scss": "scss",
    ".bookshop.toml": "config",
    ".stories.toml": "config", //TODO: Remove legacy bookshop config
};
const components = {};


const setupBookshopPolymorph = () => {
    window.bookshopPolymorph = true;
    console.log(`Setting up the bookshop polymorph`);    
    
    const rootEl = document.querySelector('html');
    rootEl.setAttribute('data-bookshop-hmr', 'true');

    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.dataset.bookshopStyle = true;
    style.innerHTML = bookshopStyles;
    head.appendChild(style);
    window.polymorphStyle = style;

    const polymorphRenderTarget = document.querySelector('[data-bookshop-polymorph]');
    polymorphRenderTarget.innerHTML = "";
    window.polymorphRenderer = new Polymorph({
        target: polymorphRenderTarget,
        props: {
            components: components
        }
    });

    const socket = new WebSocket('ws://localhost:8070/');

    socket.addEventListener('open', function (event) {
        socket.send('Hello Server!');
    });

    socket.addEventListener('message', function (event) {
        console.log('Message from server ', event.data);
        if (event.data === "new-components") {
            document.querySelectorAll('[data-bookshop-reload]').forEach(el => {
                el.remove()
            });
            const head = document.getElementsByTagName('head')[0];
            const script = document.createElement('script');
            script.dataset.bookshopReload = true;
            script.src = `http://localhost:8070/bookshop.js?q=${Date.now()}`;
            head.appendChild(script);
        }
    });
};

const loadNewPolymorphComponents = () => {
    Object.entries(bookshopComponents).forEach(([filename, source]) => {
        const componentName = filename.split('components/')[1]?.replace(/\/[^\/]+$/, '');
        let componentType = filename.match(/\/[^\/\.]+([^\/]+)$/)?.[1];
        componentType = componentMap[componentType] ?? 'other';

        if (componentName) {
            if (!components[componentName]) {
                components[componentName] = {};
            }
            components[componentName][componentType] = source;
        }
    });

    if (window.polymorphRenderer) {
        window.polymorphRenderer.$$set({
            components: components
        });
    }

    if (window.polymorphStyle) {
        window.polymorphStyle.innerHTML = bookshopStyles;
    }
}

loadNewPolymorphComponents();

const selfIsFirstInstance = !!window.bookshopPolymorph;
if (!selfIsFirstInstance) {
    setupBookshopPolymorph();
}