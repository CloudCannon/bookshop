#! /usr/bin/env node

import path from "path";
import Builder from "@bookshop/builder";
import { Command } from "commander";
import {__dirname} from "./lib/build/util.js"

const program = new Command();

async function run() {
    program.requiredOption("-b, --bookshop <paths...>", "Paths to bookshops (space seperated)");
    program.requiredOption("-o, --output <filename>", "Output JS to given filename");
    program.option("--exclude <tags...>", "Component tags to exclude (space seperated)");
    program.option("--only-engines <engines...>", "Only load the specified engines");
    program.parse(process.argv);
    const options = program.opts();
    const bookshopDirs = options.bookshop.map(d => path.join(process.cwd(), d));
    const outputFile = path.join(process.cwd(), options.output);

    const builderOptions = {
        esbuild: {
            outfile: outputFile,
            entryPoints: [path.join(__dirname(import.meta.url), 'lib/app/app.js')]
        },
        exclude: JSON.stringify(options.exclude || []),
        onlyEngines: options.onlyEngines,
        bookshopDirs: bookshopDirs
    }

    const output = await Builder(builderOptions);
    console.log(output);
}

run();