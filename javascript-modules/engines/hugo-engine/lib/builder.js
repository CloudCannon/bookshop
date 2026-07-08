import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const extensions = [".hugo.html"];

export const esbuildConfigFn = (esbuildConfig, options) => {
    esbuildConfig.loader = {
        ...esbuildConfig.loader,
        ".html": "text",
        ".hugo.html": "text",
        ".wasm.gz": options?.hosted ? "file" : "binary",
    };

    const wasm_exec_banner = fs.readFileSync(path.join(__dirname, "../full-hugo-renderer/wasm_exec.js"), "utf8");
    esbuildConfig.banner = {
        ...esbuildConfig.banner,
        js: (esbuildConfig.banner?.js ?? "") + wasm_exec_banner
    }

    // Expose the Go runtime source to the bundle so the engine can spin up a
    // Web Worker that runs the Hugo WASM off the main thread. Defined here
    // (rather than fetched at runtime) so it works regardless of hosting/CDN
    // path. When absent (e.g. the Node unit tests import engine.js directly,
    // with no esbuild), the engine falls back to running the WASM inline.
    esbuildConfig.define = {
        ...esbuildConfig.define,
        __BOOKSHOP_WASM_EXEC_SOURCE__: JSON.stringify(wasm_exec_banner),
    };
}
