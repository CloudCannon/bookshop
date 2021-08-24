#! /usr/bin/env node

import path from "path";
import Builder from "@bookshop/builder";
import { Command } from "commander";
import sveltePlugin from "esbuild-svelte";
import svelteFixPlugin from "./lib/build/svelteFixPlugin.js";
import materialIconPlugin from "./lib/build/materialIconPlugin.js";
import {__dirname} from "./lib/build/util.js";
import BrowserServer from "./lib/build/browserServer.js";

const program = new Command();

async function run() {
    program.requiredOption("-b, --bookshop <paths...>", "Paths to bookshops (space seperated)");
    program.option("-o, --output <filename>", "Output JS to given filename");
    program.option("-p, --port <number>", "Host bookshop browser server on a local port");
    program.option("--only-engines <engines...>", "Only load the specified engines");
    program.parse(process.argv);
    const options = program.opts();
    const bookshopDirs = options.bookshop.map(d => path.join(process.cwd(), d));
    const outfile = options.output ? path.join(process.cwd(), options.output) : null;
    const port = options.port ?? null;
    let server = null;
    const watch = outfile ? null : {
        onRebuild(error, result) {
            if (error) {
                console.error('📚 Renderer rebuild failed:', error)
            } else if (server && result?.outputFiles[0]) {
                server.pushNewFile(result?.outputFiles[0].text);
            }
        },
    };

    if (outfile && port) {
        console.error(`Output file and port both specified — one or the other must be passed.`);
        process.exit(1);
    }

    if (!outfile && !port) {
        console.error(`One of --output or --port must be passed.`);
        process.exit(1);
    }

    const builderOptions = {
        esbuild: {
            plugins: [
                sveltePlugin({compileOptions: {css: true}}),
                materialIconPlugin(),
                svelteFixPlugin
            ],
            loader: {
                ".svg": "text"
            },
            define: {
                BOOKSHOP_HMR_PORT: port ?? false
            },
            ...(outfile ? {outfile} : null),
            ...(watch ? {watch, write: false} : null),
            entryPoints: [path.join(__dirname(import.meta.url), 'lib/app/app.js')]
        },
        exclude: JSON.stringify(options.exclude || []),
        onlyEngines: options.onlyEngines,
        bookshopDirs: bookshopDirs
    }

    const output = await Builder(builderOptions);

    console.log(`Compiled bookshop.js with ${output.errors.length} errors and ${output.warnings.length} warnings.`);
    if (watch) {
        server = new BrowserServer({
            port: port,
            currentMemoryFile: output?.outputFiles?.[0]?.text
        });
    }
}

run();