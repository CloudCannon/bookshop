import engines from `__bookshop_engines__`;
import styles from `__bookshop_styles__`;
import components from `__bookshop_components__`;

import Browser from './svelte/browser.svelte';
import BrowserSockets from './sockets.js'

if (window.BookshopBrowser) {
    window.BookshopBrowser.engines = engines;
    window.BookshopBrowser.styles = styles;
    window.BookshopBrowser.components = components;
    window.BookshopBrowser.render();
}

const connectBrowserSockets = () => {
    window.BookshopBrowserSockets = new BrowserSockets();
}

const registerBrowserClass = () => {
    window.BookshopBrowserClass = class BookshopBrowser {
        constructor(options) {
            this.engines = engines;
            this.styles = styles;
            this.components = components;
            this.elements = [];

            this.globalData = {};
            options?.globals?.forEach(global => {
                if (global && typeof global === 'object') {
                    Object.assign(this.globalData, global);
                }
            });

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
                        globalData: this.globalData,
                        exclude: el.excludeTags
                    }
                })
            } else {
                el.browserApp.$$set({
                    engines: this.engines,
                    components: this.components
                });
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
}

if (!window.BookshopBrowserClass) {
    registerBrowserClass();

    if (BOOKSHOP_HMR_PORT) {
        connectBrowserSockets();
    }
}