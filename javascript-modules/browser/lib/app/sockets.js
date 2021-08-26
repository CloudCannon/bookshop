export default class BookshopBrowserSockets {
    constructor() {
        this.head = document.querySelector('head');
        this.host = `localhost:${BOOKSHOP_HMR_PORT}`;
        this.init();
    }

    init() {
        this.socket = new WebSocket(`ws://${this.host}/`);
        this.socket.addEventListener('open', (event) => {
            this.socket.send('__bookshop_browser_connect__');
        });
        this.socket.addEventListener('message', this.handleNewComponents.bind(this));
    }

    handleNewComponents(event) {
        if (event.data !== "new-components") return;
        this.removeExistingScripts();

        const script = document.createElement('script');
        script.dataset.bookshopBrowserReload = true;
        script.src = `http://${this.host}/bookshop.js?q=${Date.now()}`;
        this.head.appendChild(script);
    }

    removeExistingScripts() {
        document.querySelectorAll('[data-bookshop-browser-reload]').forEach(el => {
            el.remove()
        });
    }
}
