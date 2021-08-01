import engines from `__bookshop_engines__`;
import styles from `__bookshop_styles__`;
import components from `__bookshop_components__`;
import Browser from './svelte/browser.svelte';

window.BookshopBrowser = class BookshopBrowser {
    constructor() {
        this.engines = engines;
        this.styles = styles;
        this.components = components;
        this.elements = [];
        this.init();
    }

    init() {
        const browserTargets = document.querySelectorAll('[data-bookshop-browser]');
        this.elements = [...browserTargets].map(this.readElement);
    }

    readElement(el) {
        const excludeString = el.dataset.bookshopBrowserExclude;
        const excludeTags = excludeString ? excludeString.split(',') : [];
        return {
            dom: el,
            scriptSource: el.dataset.bookshopBrowser,
            excludeTags: excludeTags,
            browserApp: null
        }
    }

    render() {
        BookshopBrowser.stripDocumentBookshopStyles();
        this.injectHeadBookshopStyles();
        this.elements.forEach(this.renderElement.bind(this));
    }

    async renderElement(el) {
        if (!el.browserApp) {
            el.browserApp = new Browser({
                target: el.dom,
                props: {
                    engines: this.engines,
                    components: this.components,
                    exclude: el.excludeTags
                }
            })
        } else {
            //TODO: update existing app
        }
    }

    injectHeadBookshopStyles() {
        this.stripHeadBookshopStyles();
        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.dataset.bookshopBrowserStyles = true;
        style.innerHTML = this.styles;
        head.appendChild(style);
    }

    stripHeadBookshopStyles() {
        document.querySelectorAll('[data-bookshop-browser-styles]').forEach(el => {
            el.remove()
        });
    }

    /**
     * Remove component styles from the compiled site CSS.
     * These will be inside "@media all, bookshop {}" rules.
     * We do this so we can then inject the hot reloading CSS onto the page ourselves.
     **/
    static stripDocumentBookshopStyles() {
        [...document.styleSheets].forEach(ss => {
            try {
                bookshopRules = [];
                [...ss.cssRules].forEach((rule, i) => {
                    if (/bookshop/.test(rule.conditionText)) {
                        bookshopRules.unshift(i);
                    }
                });
                // Delete the bookshop blocks, bottom up
                bookshopRules.forEach(i => ss.deleteRule(i));
            } catch(e) {}
        })
    }
}

// const setupBookshopRenderer = () => {
//     const bookshopRenderTargets = document.querySelectorAll('[data-bookshop-renderer]');
//     if (!bookshopRenderTargets.length) return;

//     window.bookshopRenderers = [];
//     console.log(`Setting up a new bookshop renderer.`);

//     injectPageStyles();
//     stripBookshopStyles();
    
//     bookshopRenderTargets.forEach(bookshopRenderTarget => {
//         bookshopRenderTarget.innerHTML = "";
//         window.bookshopRenderers.push(
//             new Renderer({
//                 target: bookshopRenderTarget,
//                 props: {
//                     components: components,
//                     exclude: BOOKSHOP_EXCLUDE
//                 }
//             })
//         );
//     })
    
//     if (BOOKSHOP_HMR_AVAILABLE) {
//         const socket = new WebSocket(`ws://localhost:${BOOKSHOP_HMR_PORT}/`);
        
//         socket.addEventListener('open', function (event) {
//             socket.send('Hello Server!');
//         });
        
//         socket.addEventListener('message', function (event) {
//             if (event.data === "new-components") {
//                 document.querySelectorAll('[data-bookshop-reload]').forEach(el => {
//                     el.remove()
//                 });
//                 const head = document.getElementsByTagName('head')[0];
//                 const script = document.createElement('script');
//                 script.dataset.bookshopReload = true;
//                 script.src = `http://localhost:${BOOKSHOP_HMR_PORT}/bookshop.js?q=${Date.now()}`;
//                 head.appendChild(script);
//             }
//         });
//     }
// };



// window.BookshopLive = class BookshopLive {
//     constructor() {
//         this.engines = engines;
//         this.elements = [];
//         this.init();
//     }

//     init() {
//         const liveRenderTargets = document.querySelectorAll('[data-bookshop-live]');
//         this.elements = [...liveRenderTargets].map(this.readElement);
//         this.data = {};
//     }

//     readElement(el) {
//         return {
//             dom: el,
//             originalHTML: el.innerHTML,
//             componentName: el.dataset.bookshopLive,
//             componentPropSource: el.dataset.bookshopProps,
//         }
//     }

//     async renderElement(el) {
//         const data = this.dig(el.componentPropSource);
//         if (!data) return;
//         const rendered = await this.engines[0].render(el.componentName, data);
//         el.dom.innerHTML = rendered;
//     }

//     update(data) {
//         this.data = data;
//         this.render();
//     }

//     render() {
//         this.elements.forEach(this.renderElement.bind(this));
//     }

//     dig(keys, scope) {
//         if (!keys) return null;
//         if (!Array.isArray(keys)) keys = keys.split('.');
//         scope = (scope ?? this.data)[keys.shift()];
//         if(scope && keys.length) {
//           return this.dig(keys, scope);
//         }
//         return scope;
//     }
// }

// console.log(engines);
// window.engines = engines;

// import componentDefinitions from `__bookshop_components__`;
// console.log(componentDefinitions);

// import styles from `__bookshop_styles__`;
// console.log(styles);



// import bookshopComponents from `components`;
// import bookshopStyles from `components.bookshop_scss`;
// import Renderer from './renderer.svelte';
// import LiveComponent from './liveComponent.svelte';

// const componentMap = {
//     ".jekyll.html": "jekyll",
//     ".svelte": "svelte",
//     ".scss": "scss",
//     ".bookshop.toml": "config"
// };
// const components = {};

// // TODO: Move
// const coreStyles = `
// .cm-gutters {
//     min-height: 300px !important;
// }
// .bookshop-renderer .material-icons { 
//     opacity: 0;
//     animation: bookshop-renderer-icons 0.2s linear 0.5s forwards;
// }
// @keyframes bookshop-renderer-icons {
//     0% {
//         opacity: 0;
//     }
//     100% {
//         opacity: 1;
//     }
// }
// `;

// const injectPageStyles = () => {
//     const head = document.getElementsByTagName('head')[0];
//     const style = document.createElement('style');
//     style.dataset.bookshopStyle = true;
//     style.innerHTML = bookshopStyles + coreStyles;
//     head.appendChild(style);
//     window.bookshopRendererStyle = style; 
// }

// /**
//  * Remove component styles from the compiled site CSS.
//  * These will be inside "@media all, bookshop {}" rules.
//  * We do this so we can then inject the component CSS onto the page ourselves.
//  */
// const stripBookshopStyles = () => {
//     [...document.styleSheets].forEach(ss => {
//         try {
//             bookshopRules = [];
//             [...ss.cssRules].forEach((rule, i) => {
//                 if (/bookshop/.test(rule.conditionText)) {
//                     bookshopRules.unshift(i);
//                 }
//             });
//             bookshopRules.forEach(i => ss.deleteRule(i));
//         } catch(e) {}
//     })
// };

// const setupBookshopLive = () => {
//     if (window.inEditorMode) {
//         window.liveComponents = window.liveComponents || [];
//         window.CloudCannon = {
//             trigger: function (eventName, frontMatter) {
//                 if (typeof frontMatter === "string") frontMatter = JSON.parse(frontMatter);
//                 window.liveComponents.forEach(liveComponent => {
//                     if (liveComponent.propSource.length) {
//                         data = liveComponent.propSource.split('.').reduce((o,i)=>o[i], frontMatter)
//                     } else {
//                         data = frontMatter;
//                     }
//                     liveComponent.component.$$set({
//                         props: data
//                     })
//                 });
//                 console.log(`Pushing a ${eventName}`);
//             }
//         }

//         const liveRenderTargets = document.querySelectorAll('[data-bookshop-live]');
//         liveRenderTargets.forEach(target => {
//             const originalHTML = target.innerHTML;
//             const componentName = target.dataset.bookshopLive;
//             const componentPropSource = target.dataset.bookshopProps;
//             target.innerHTML = "";
//             window.liveComponents.push({
//                 propSource: componentPropSource?.replace(/^page(\.|$)/, ''),
//                 component: new LiveComponent({
//                     target: target,
//                     props: {
//                         components: components,
//                         originalHTML: originalHTML,
//                         selectedComponent: componentName
//                     }
//                 })
//             });
//         });
//     }
// }

// const setupBookshopRenderer = () => {
//     const bookshopRenderTargets = document.querySelectorAll('[data-bookshop-renderer]');
//     if (!bookshopRenderTargets.length) return;

//     window.bookshopRenderers = [];
//     console.log(`Setting up a new bookshop renderer.`);

//     injectPageStyles();
//     stripBookshopStyles();
    
//     bookshopRenderTargets.forEach(bookshopRenderTarget => {
//         bookshopRenderTarget.innerHTML = "";
//         window.bookshopRenderers.push(
//             new Renderer({
//                 target: bookshopRenderTarget,
//                 props: {
//                     components: components,
//                     exclude: BOOKSHOP_EXCLUDE
//                 }
//             })
//         );
//     })
    
//     if (BOOKSHOP_HMR_AVAILABLE) {
//         const socket = new WebSocket(`ws://localhost:${BOOKSHOP_HMR_PORT}/`);
        
//         socket.addEventListener('open', function (event) {
//             socket.send('Hello Server!');
//         });
        
//         socket.addEventListener('message', function (event) {
//             if (event.data === "new-components") {
//                 document.querySelectorAll('[data-bookshop-reload]').forEach(el => {
//                     el.remove()
//                 });
//                 const head = document.getElementsByTagName('head')[0];
//                 const script = document.createElement('script');
//                 script.dataset.bookshopReload = true;
//                 script.src = `http://localhost:${BOOKSHOP_HMR_PORT}/bookshop.js?q=${Date.now()}`;
//                 head.appendChild(script);
//             }
//         });
//     }
// };

// const loadNewRendererComponents = () => {
//     Object.entries(bookshopComponents).forEach(([filename, source]) => {
//         const componentName = filename.split('components/')[1]?.replace(/\/[^\/]+$/, '');
//         let componentType = filename.match(/\/[^\/\.]+([^\/]+)$/)?.[1];
//         componentType = componentMap[componentType] ?? 'other';
        
//         if (componentName) {
//             if (!components[componentName]) {
//                 components[componentName] = {};
//             }
//             components[componentName][componentType] = source;
//         }
//     });

//     window.bookshopRenderers?.forEach(renderer => {
//         console.log(`Reloading bookshop renderer components`);
//         renderer.$$set({
//             components: components
//         });
//     })
    
//     if (window.bookshopRendererStyle) {
//         window.bookshopRendererStyle.innerHTML = bookshopStyles + coreStyles;
//     }
// }

// loadNewRendererComponents();

// const selfIsFirstInstance = !window.bookshopRenderers;
// if (selfIsFirstInstance) {
//     setupBookshopRenderer();
//     setupBookshopLive();
// }