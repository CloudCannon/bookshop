import bookshopComponents from `components`;
import bookshopStyles from `components.bookshop_scss`;
import Polymorph from './polymorph.svelte';

console.log('Bookshop polymorph initialising.');

const componentMap = {
    ".jekyll.html": "jekyll",
    ".svelte": "svelte",
    ".scss": "scss",
    ".bookshop.toml": "config"
};
const components = {};

// TODO: Move
const coreStyles = `
.cm-gutters {
    min-height: 300px !important;
}
`;

const setupBookshopPolymorph = () => {
    window.bookshopPolymorph = true;
    console.log(`Setting up the bookshop polymorph`);    
    
    const rootEl = document.querySelector('html');
    rootEl.setAttribute('data-bookshop-hmr', 'true');

    const head = document.getElementsByTagName('head')[0];
    const style = document.createElement('style');
    style.dataset.bookshopStyle = true;
    style.innerHTML = bookshopStyles + coreStyles;
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

    if (BOOKSHOP_HMR_AVAILABLE) {
        const socket = new WebSocket(`ws://localhost:${BOOKSHOP_HMR_PORT}/`);

        socket.addEventListener('open', function (event) {
            socket.send('Hello Server!');
        });

        socket.addEventListener('message', function (event) {
            if (event.data === "new-components") {
                document.querySelectorAll('[data-bookshop-reload]').forEach(el => {
                    el.remove()
                });
                const head = document.getElementsByTagName('head')[0];
                const script = document.createElement('script');
                script.dataset.bookshopReload = true;
                script.src = `http://localhost:${BOOKSHOP_HMR_PORT}/bookshop.js?q=${Date.now()}`;
                head.appendChild(script);
            }
        });
    }
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