import path from "path";
import Builder from "@bookshop/builder";
import { Command } from "commander";
import sveltePlugin from "esbuild-svelte";
import svelteFixPlugin from "./lib/build/svelteFixPlugin.js"
import materialIconPlugin from "./lib/build/materialIconPlugin.js"
import {__dirname} from "./lib/build/util.js"

const program = new Command();

async function run() {
    program.requiredOption("-b, --bookshop <paths...>", "Paths to bookshops (space seperated)");
    program.option("-o, --output <filename>", "Output JS to given filename");
    program.parse(process.argv);
    const options = program.opts();
    const bookshopDirs = options.bookshop.map(d => path.join(process.cwd(), d));
    const outputFile = path.join(process.cwd(), options.output);

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
            outfile: outputFile,
            entryPoints: [path.join(__dirname(import.meta.url), 'lib/app/app.js')]
        },
        exclude: JSON.stringify(options.exclude || []),
        bookshopDirs: bookshopDirs
    }

    const output = await Builder(builderOptions);
    console.log(output);
}

run();