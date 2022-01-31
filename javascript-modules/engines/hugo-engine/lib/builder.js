import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const extensions = [".hugo.html"];

export const esbuildConfigFn = (esbuildConfig) => {
    esbuildConfig.loader = {
        ...esbuildConfig.loader,
        ".hugo.html": "text",
        ".wasm": "file"
    };

    const wasm_exec_banner = fs.readFileSync(path.join(__dirname, "../hugo-renderer/wasm_exec.js"));
    esbuildConfig.banner = {
        ...esbuildConfig.banner,
        js: (esbuildConfig.js ?? "") + wasm_exec_banner
    }
}
