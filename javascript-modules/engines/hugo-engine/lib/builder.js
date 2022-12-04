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

    const wasm_exec_banner = fs.readFileSync(path.join(__dirname, "../full-hugo-renderer/wasm_exec.js"));
    esbuildConfig.banner = {
        ...esbuildConfig.banner,
        js: (esbuildConfig.js ?? "") + wasm_exec_banner
    }
}
