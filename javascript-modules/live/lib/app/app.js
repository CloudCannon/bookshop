console.log("My pipeline is working");

import bookshop from `__bookshop_state__`;
console.log(bookshop);

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