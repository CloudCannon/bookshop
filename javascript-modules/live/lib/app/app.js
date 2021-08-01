import engines from `__bookshop_engines__`;
window.BookshopLive = class BookshopLive {
    constructor() {
        this.engines = engines;
        this.elements = [];
        this.init();
    }

    init() {
        const liveRenderTargets = document.querySelectorAll('[data-bookshop-live]');
        this.elements = [...liveRenderTargets].map(this.readElement);
        this.data = {};
    }

    readElement(el) {
        return {
            dom: el,
            originalHTML: el.innerHTML,
            componentName: el.dataset.bookshopLive,
            componentPropSource: el.dataset.bookshopProps,
        }
    }

    async renderElement(el) {
        const data = this.dig(el.componentPropSource);
        if (!data) return;
        const rendered = await this.engines[0].render(el.componentName, data);
        el.dom.innerHTML = rendered;
    }

    update(data) {
        this.data = data;
        this.render();
    }

    render() {
        this.elements.forEach(this.renderElement.bind(this));
    }

    dig(keys, scope) {
        if (!keys) return null;
        if (!Array.isArray(keys)) keys = keys.split('.');
        scope = (scope ?? this.data)[keys.shift()];
        if(scope && keys.length) {
          return this.dig(keys, scope);
        }
        return scope;
    }
}
