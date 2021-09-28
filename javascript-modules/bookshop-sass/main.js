#! /usr/bin/env node

import path from "path";
import fs from "fs/promises";
import Builder from "@bookshop/builder";
import { Command } from "commander";

const program = new Command();

/**
 * Compiles all scss files in the bookshop directory to the output CSS file.
 * Most of the work leverages the @bookshop/builder package, which includes
 * esbuild loaders for interacting with bookshops.
 * Importing __bookshop_styles__ through the builder will automatically compile
 * all scss files, and run postcss if configured in an appropriate directory.
 * We then have to "import" the code esbuild spits out to get the text to write to disk.
 */
async function run() {
    program.requiredOption("-b, --bookshop <paths...>", "Paths to bookshops (space seperated)");
    program.requiredOption("-o, --output <filename>", "Output CSS to given filename");
    program.option("-w, --watch", "Watch bookshop sass files for changes");
    program.parse(process.argv);

    const options = program.opts();
    const bookshopDirs = options.bookshop.map(d => path.join(process.cwd(), d));
    const output = path.join(process.cwd(), options.output);
    const watch = options.watch ? {
        onRebuild(error, result) {
            if (error) {
                console.error('📚 Sass rebuild failed:', error)
            } else if (result?.outputFiles[0]) {
                outputFile(output, result.outputFiles[0].text);
            }
        },
    } : null;

    const opts = {
        esbuild: {
            stdin: {
                contents: `export {default} from "__bookshop_styles__";`,
                resolveDir: process.cwd(),
                sourcefile: 'virtual.js'
            },
            format: 'esm',
            write: false,
            bundle: true,
            watch
        },
        bookshopDirs
    };

    const compiled = await Builder(opts);
    console.log(`Compiled Bookshop Sass with ${compiled.errors.length} errors and ${compiled.warnings.length} warnings.`);
    compiled.errors.map(e => console.error(e));
    compiled.warnings.map(e => console.warn(e));
    await outputFile(output, compiled.outputFiles[0].text);
}

const outputFile = async (filePath, fileContents) => {
    // esbuild spits out an ESM export, so we need to evaluate it to get the sass text
    const js = Buffer.from(fileContents, 'utf8');
    const dataUri = 'data:text/javascript;base64,'+ js.toString('base64');
    const {default: styles} = await import(dataUri);
    const wrappedStyles = `@media all, bookshop {\n\n${styles}\n\n}`;

    console.log(`📚 Writing styles to ${path.basename(filePath)}`);
    await fs.mkdir(path.dirname(filePath), {recursive: true});
    return fs.writeFile(filePath, wrappedStyles);
}

run();