#! /usr/bin/env node
import path from 'path';
import fs from 'fs';
import { Command } from "commander";
import chalk from 'chalk';
import fastGlob from 'fast-glob';

import { hydrateLiveForSite } from "./lib/live-connector.js";
import { buildLiveScript } from "./lib/live-builder.js";
import { hydrateComponentBrowserForSite } from "./lib/browser-connector.js";
import { buildBrowserScript } from "./lib/browser-builder.js";
import { buildStructures } from "./lib/structure-builder.js";
import { hydrateStructures } from "./lib/structure-connector.js";

const cwd = process.cwd();
const program = new Command();

const plur = (num, str, pluralStr) => {
    const pluralized = num === 1 ? str : (pluralStr ?? `${str}s`);
    return `${num} ${pluralized}`;
}

async function run() {
    program.option("-d, --dot", "Look for Bookshops inside . directories");
    program.option("--skip-live", "Don't build live editing JS or add live editing scripts to HTML");
    program.option("--skip-components", "Don't build the component browser JS or add component browser scripts to HTML");
    program.option("--disable-bindings", "Don't create data binding panels when live editing");
    program.parse(process.argv);
    const options = program.opts();

    console.log(`📚 Generating Bookshop integrations`);

    console.log(chalk.bold(`\nLooking for Bookshop component libraries...`));
    const { bookshopRoots, structures, relocations } = await buildStructures(options);

    if (!bookshopRoots.length) {
        console.error(chalk.bold.red(`\nCould not find any Bookshops in ${cwd}`));
        console.error(chalk.bold.yellow(`\n — Is it in a dot folder? Try passing the ${chalk.cyan(`--dot`)} flag`));
        console.error(chalk.bold.yellow(`\n — Does it have a config file? To be discovered, it needs a ${chalk.cyan(`bookshop/bookshop.config.js`)} file`));
        process.exit(1);
    }
    console.log(`Loaded ${plur(bookshopRoots.length, "Bookshop")}`);

    console.log(chalk.bold(`\nLooking for output sites...`));

    const infoJsonFiles = await fastGlob(`./**/_cloudcannon/info.json`, {
        cwd,
        dot: !!options.dot
    });

    if (!infoJsonFiles.length) {
        console.error(chalk.bold.red(`\nCould not find any output sites in ${cwd}`));
        console.error(chalk.bold.yellow(`\nAre you running this on CloudCannon?`));
        console.error(chalk.bold.yellow(`\nTo be discovered, it needs a ${chalk.cyan(`_cloudcannon/info.json`)} file`));
        console.error(chalk.bold.yellow(`\nThis file should have been generated automatically for you`));
        console.error(chalk.bold.yellow(`\nSee https://cloudcannon.com/documentation/articles/integrating-your-site/ for help, or contact support`));
        process.exit(1);
    }
    console.log(`Found ${plur(infoJsonFiles.length, "site")}`);

    for (const infoJsonFile of infoJsonFiles) {
        const siteRoot = path.dirname(path.dirname(infoJsonFile));
        console.log(chalk.bold.magenta(`\nModifying output site at ./${siteRoot}`));
        const contents = fs.readFileSync(infoJsonFile, "utf8");
        const infoJson = JSON.parse(contents);

        hydrateStructures(infoJson, structures, options);

        for (const relocation of relocations) {
            const outputFile = path.join(siteRoot, relocation.to);
            fs.mkdirSync(path.dirname(outputFile), { recursive: true });
            fs.copyFileSync(path.join(process.cwd(), relocation.from), outputFile);
        }
        console.log(chalk.green(`Connected ${relocations.length} component thumbnail(s)`));

        if (!options.skipLive) {
            const liveEditingNeeded = await hydrateLiveForSite(siteRoot, options);
            if (liveEditingNeeded) {
                const prefetchFiles = await buildLiveScript(siteRoot, bookshopRoots);
                if (prefetchFiles?.length) {
                    infoJson["prefetchFiles"] = infoJson["prefetchFiles"] || {};
                    for (const file of prefetchFiles) {
                        infoJson["prefetchFiles"][file] = file;
                    }
                }
            }
        } else {
            console.log(chalk.gray(`Skipping live editing generation`));
        }

        if (!options.skipComponents) {
            const componentBrowserNeeded = await hydrateComponentBrowserForSite(siteRoot, options);
            if (componentBrowserNeeded) {
                await buildBrowserScript(siteRoot, bookshopRoots);
            }
        } else {
            console.log(chalk.gray(`Skipping component browser generation`));
        }

        fs.writeFileSync(infoJsonFile, JSON.stringify(infoJson, null, 2));
        console.log(chalk.green(`Added components as CloudCannon Structures`));
    }

    console.log(chalk.green.bold(`\n📚🏁 Finished. Added ${plur(structures.length, "structure")} from ${plur(bookshopRoots.length, "Bookshop")} to ${plur(infoJsonFiles.length, "site")}.`));
}

run();
