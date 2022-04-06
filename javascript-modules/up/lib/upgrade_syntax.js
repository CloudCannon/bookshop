import { createRequire } from "module";
import { rewriteLegacyToml } from "./util.js";
import fs from 'fs';
import path from 'path';
import fastGlob from 'fast-glob';
import chalk from 'chalk';
import inquirer from "inquirer";

import TOML from '@ltd/j-toml';
import YAML from 'yaml';

import { buildNewSyntaxFromOld } from "./upgrade_syntax_blueprinter.js";
import * as output from "./upgrade_syntax_outputs.js";

const require = createRequire(import.meta.url);
const cwd = process.cwd();

const loadTOML = (file) => {
    let contents = fs.readFileSync(file, "utf8");
    contents = rewriteLegacyToml(contents);
    return TOML.parse(contents, 1.0, '\n', false);
}

const loadYAML = (file) => {
    let contents = fs.readFileSync(file, "utf8");
    return YAML.parse(contents);
}

const loadJSON = (file) => {
    return require(path.join(cwd, file));
}

const loadJS = (file) => {
    const js = require(path.join(cwd, file));
    return (typeof js === "function") ? js() : js;
}

const loadFile = (file) => {
    const filetype = path.basename(file).split('.').reverse()[0].toLowerCase();
    switch (filetype) {
        case "toml":
            return [loadTOML(file), filetype];
        case "yaml":
        case "yml":
            return [loadYAML(file), filetype];
        case "json":
            return [loadJSON(file), filetype];
        case "js":
        case "cjs":
            return [loadJS(file), filetype];
        default:
            console.log(chalk.bold.red(`\nUnknown filetype: ${file}`));
            return [null, filetype];
    }
}

export const upgradeSyntax = async (options) => {
    const upgrades = [];

    if (/^2\./.test(options.version)) {
        return upgrades;
    }

    console.log(chalk.bold(`\nChecking Bookshop Syntax...`));
    const bookshopConfigFiles = await fastGlob(`./**/*.bookshop.*`, {
        cwd,
        dot: !!options.dot
    });

    const files = [];

    for (const bookshopConfigFile of bookshopConfigFiles) {
        let rawContents = fs.readFileSync(bookshopConfigFile, "utf8");
        try {
            let [contents, format] = loadFile(bookshopConfigFile);
            if (!contents) continue;
            let is_outdated = contents?.props || contents?.component;
            files.push({
                path: bookshopConfigFile,
                contents,
                rawContents,
                format,
                is_outdated,
            });
        } catch (e) {
            console.error(chalk.red.bold(`ERROR: Couldn't parse ${bookshopConfigFile}`, e));
            console.error(chalk.red.bold(`Cancelling upgrade — no files were changed.`));
            process.exit(1);
        }
    }

    let targetFormat = options.format;
    if (targetFormat) {
        console.log(chalk.yellow.bold(`\nConverting Bookshop files to ${targetFormat}\n`));
    } else {
        if (files.some(f => f.is_outdated)) {
            console.log(chalk.yellow.bold(`\nSome Bookshop files needs to be upgraded to match the Bookshop 3.x syntax`));
            console.log(chalk.yellow.bold(`In version 2.x, config was restricted to TOML. In 3.x, you can choose which config format you want to use`));
            console.log(chalk.yellow.bold(`This tool can convert your files automatically for you while upgrading your syntax`));
            console.log(chalk.yellow.bold(`(You can run this tool again later with the ${chalk.cyan(`--format`)} flag if you change your mind)\n`));
            const resp = await inquirer.prompt([{
                type: 'list',
                name: 'format',
                message: 'What configuration format would you like to use?',
                choices: ['YAML (Recommended)', 'TOML', 'JS', 'JSON'],
                filter(val) {
                    return val.split(' ')[0].toLowerCase().replace(/yaml/, 'yml');
                },
            }]);
            targetFormat = resp.format;
            console.log("");
        } else {
            console.log(chalk.greenBright(`✅ ${files.length} Bookshop config file${files.length == 1 ? '' : 's'} match${files.length == 1 ? 'es' : ''} 3.0 syntax`));
            console.log(`Run this command with ${chalk.cyan(`--format <type>`)} if you want to change to a different filetype`);
            return upgrades;
        }
    }

    for (let file of files) {
        const upgrade = { file: file.path };
        if (file.format !== targetFormat) {
            const r = new RegExp(`${file.format}$`, 'i');
            upgrade.newFile = upgrade.file.replace(r, targetFormat);
        }

        if (!upgrade.newFile && !file.is_outdated) {
            console.log(chalk.greenBright(`✅ ${file.path} @ 3.0`));
            continue;
        }

        console.log(chalk.magenta(`🌟 ${upgrade.file} @ ${file.is_outdated ? '2.0' : '3.0'} → ${chalk.bold.yellow(targetFormat)} @ 3.0`));

        let newSyntax;
        if (file.is_outdated) {
            const blueprint = file.contents?.props || {};
            const inputs = {}, preview = JSON.parse(JSON.stringify(blueprint));
            const { b, p } = buildNewSyntaxFromOld(blueprint, "props", inputs, preview);
            newSyntax = {
                spec: file.contents?.component || {},
                blueprint: b || {},
                preview: p || {},
                _inputs: inputs || {},
            }
        } else {
            newSyntax = file.contents;
        }

        let outputFile = "";
        switch (targetFormat) {
            case "yml":
                outputFile = output.buildYAML(newSyntax);
                break;
            case "toml":
                outputFile = output.buildTOML(newSyntax);
                break;
            case "json":
                outputFile = output.buildJSON(newSyntax);
                break;
            case "js":
                outputFile = output.buildJS(newSyntax);
                break;
        }

        upgrade.contents = outputFile.replace(/.+BOOKSHOP_BLANK_LINE\n/g, '').replace(/\n.+BOOKSHOP_BLANK_LINE/g, '');

        if (options.debug) {
            console.log(chalk.cyan.bold(`🗒️  converting from:`));
            console.log(file.rawContents);
            console.log(chalk.cyan.bold(`🗒️  converting to:`));
            console.log(outputFile);
        }

        upgrades.push(upgrade);
    }

    return upgrades;
}