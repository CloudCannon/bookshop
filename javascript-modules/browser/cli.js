#! /usr/bin/env node

import { Command } from "commander";
import { runner } from "./main.js";
import fastGlob from 'fast-glob';
import path from 'path';

const program = new Command();

async function run() {
    program.option("-b, --bookshop <paths...>", "Explicit paths to bookshops (space seperated). If not specified, bookshops will be recursively discovered within the current directory");
    program.option("-p, --port <number>", "Port number to host the local component browser on");
    program.option("-d, --dot", "Look for Bookshops inside . directories");
    program.option("--exclude <tags...>", "Component tags to exclude (space seperated)");
    program.option("--only-engines <engines...>", "Only load the specified engines");
    program.option("-o, --output <filename>", "DEPRECATED: outputs to a file. Use @bookshop/generate instead");
    program.parse(process.argv);
    const options = program.opts();

    if (!options.bookshop) {
        console.log(`📚 Looking for Bookshop component libraries...`);

        const bookshopConfigFiles = await fastGlob(`./**/bookshop.config.{js,cjs}`, {
            cwd: process.cwd(),
            dot: !!options.dot
        });

        options.bookshop = bookshopConfigFiles.map(f => {
            const bookshopRoot = path.dirname(path.dirname(f));
            console.log(`📚 —— Loading Bookshop from ./${bookshopRoot}`);
            return bookshopRoot;
        });

        if (!options.bookshop.length) {
            console.error(`📚 —— 🚫 Couldn't find any Bookshops within ${process.cwd()} or its children.\n         If you're running this in the correct place, you might need to pass the bookshop(s) explicitly with "-b <dir>"`);
            process.exit(1);
        }
    }

    await runner(options);
}

run();