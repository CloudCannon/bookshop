import express from "express";
import expressWs from "express-ws";

export default class BrowserServer {
  constructor(options) {
    this.port = options.port;
    this.outputFiles = options.outputFiles;
    this.sockets = [];
    this.init();
  }

  init() {
    this.app = express();
    expressWs(this.app);

    this.app.get("/", (req, res) => {
      let browserHTML = "<div data-bookshop-browser></div>";
      for (const outputFile of this.outputFiles) {
        if (outputFile.path.endsWith(".js")) {
          browserHTML += `<script src="${outputFile.path}"></script>`;
        } else if (outputFile.path.endsWith(".css")) {
          browserHTML += `<link href="${outputFile.path}" rel="stylesheet"></link>`;
        }
      }
      browserHTML += `<script>
            window.bookshopBrowser = new window.BookshopBrowser({
              globals: [window.bookshop_browser_site_data]
            });
            window.bookshopBrowser.render();
          </script>`;
      res.type(".html");
      res.send(browserHTML);
    });

    this.app.get("/*", (req, res) => {
      const outputFile = this.outputFiles.find(({ path }) => path === req.path);
      if (outputFile) {
        res.type(outputFile.path.split(".").pop());
        res.send(outputFile.text);
      }
    });

    this.app.ws("/", (ws, req) => {
      this.sockets.push(ws);
      console.log(`📚 Client Connected`);
    });

    this.app.listen(this.port, () => {
      console.log(
        `📚 Standalone Bookshop Renderer served at http://localhost:${this.port}/`,
      );
    });
  }

  pushNewFile(file) {
    this.sockets = this.sockets.filter((ws) => ws.readyState <= 1);
    if (!this.sockets.length) {
      console.log(`📚 New components — no connected clients.`);
      return;
    }
    console.log(`📚 Pushing new components to ${this.sockets.length} clients.`);
    const failedSockets = [];
    this.sockets.forEach((ws, i) => {
      try {
        ws.send("new-components");
      } catch (e) {}
    });
  }
}
