import express from 'express';
import expressWs from 'express-ws';

export default class BrowserServer {
    constructor(options) {
        this.port = options.port;
        this.currentMemoryFile = options.currentMemoryFile ?? "console.warn('bookshop browser error.');";
        this.sockets = [];
        this.init();
    }

    init() {
        this.app = express();
        expressWs(this.app);

        this.app.get('/bookshop.js', (req, res) => {
            res.type('.js');
            res.send(this.currentMemoryFile);
        })
    
        this.app.ws('/', (ws, req) => {
            this.sockets.push(ws);
            console.log(`📚 Client Connected`);
        });
        
        this.app.listen(this.port, () => {
            console.log(`📚 Bookshop Renderer served at http://localhost:${this.port}/bookshop.js`)
        })
    }

    pushNewFile(file) {
        this.currentMemoryFile = file;
        this.sockets = this.sockets.filter(ws => ws.readyState <= 1);
        if (!this.sockets.length) {
            console.log(`📚 New components — no connected clients.`);
            return;
        }
        console.log(`📚 Pushing new components to ${this.sockets.length} clients.`);
        const failedSockets = [];
        this.sockets.forEach((ws, i) => {
            try {
                ws.send('new-components');
            } catch(e) {}
        })
    }
}
