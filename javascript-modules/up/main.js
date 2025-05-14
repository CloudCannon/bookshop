#! /usr/bin/env node
import { createRequire } from "module";
import path from 'path';
import fs from 'fs';
import { execSync } from "child_process";
import { Command, Option } from "commander";
import inquirer from "inquirer";
import chalk from 'chalk';
import { plur } from "./lib/util.js";

import { upgradeNode } from "./lib/upgrade_node.js";
import { upgradeGo } from "./lib/upgrade_go.js";
import { upgradeGem } from "./lib/upgrade_gem.js";
import { upgradeSyntax } from "./lib/upgrade_syntax.js";
import { upgradeBookshopModule } from "./lib/misc/upgrade_bookshop_module.js";

const require = createRequire(import.meta.url);
const { version } = require("./package.json");

const cwd = process.cwd();
const cwdRegex = new RegExp(cwd, 'g');
const program = new Command();

const suppressCwd = (input) => input.replace(cwdRegex, '.');

async function run() {
    program.option("--dot", "Look for Bookshops inside . directories");
    program.option("--yes", "Proceed with operations");
    program.option("--dry-run", "Print operations but do not perform them");
    program.option("--skip-commands", "Modify files but do not run commands");
    program.addOption(new Option('--format <filetype>', 'Convert Bookshop files to another format').choices(['yml', 'toml', 'json', 'js']));
    program.option("--skip-migrations", "Only bump versions, do not run migrations");
    program.option("--version <version>", "Version to upgrade to if not latest");
    program.option("--debug", "Output debug information");
    program.parse(process.argv);
    const options = program.opts();

    options.version = options.version || version;

    console.log(`📚 Upgrading Bookshop to ${chalk.magenta.bold('v' + options.version)}`);
    console.log(`If this isn't correct, use the --version flag`);

    let upgrades = [
        ...await upgradeNode(options),
        ...await upgradeGo(options),
        ...await upgradeGem(options),
    ];
    // Assemble it this way so that the change summary lists formats first
    upgrades = [
        ...await upgradeSyntax(options),
        ...await upgradeBookshopModule(options),
        ...upgrades,
    ]
    upgrades.forEach(u => {
        u.dir = path.dirname(u.file).replace(/^\./, cwd);
        u.file = path.join(cwd, u.file);
        if (u.newFile) u.newFile = path.join(cwd, u.newFile);
    })

    if (!upgrades.length) {
        console.log(chalk.green.bold(`\n📚 No changes to be made, everything is up to date at version ${options.version}`));
        process.exit(0);
    }

    console.log(chalk.bold(`\n=======\n\nDigest of changes to be made:`));
    console.log(suppressCwd(upgrades.map(u => {
        let changes = [];

        if (u.contents) {
            changes.push(` — 📝 Changing the contents of ${chalk.magenta(u.file)}`);
        }

        if (u.contents && u.newFile) {
            changes.push(`      ...and renaming it to ${chalk.magenta(path.relative(path.dirname(u.file), u.newFile))}`);
        } else if (u.newFile) {
            changes.push(` — 👉 Renaming ${chalk.magenta(u.file)} to ${chalk.magenta(path.relative(path.dirname(u.file), u.newFile))}`);
        }

        if (u.commands && u.commands.length) {
            changes = [...changes, ...u.commands.map(c => {
                return ` — 💥 Running ${chalk.yellow(c)} in ${chalk.magenta(u.dir)}`
            })];
        }

        if (u.warnings && u.warnings.length) {
            changes = [...changes, ...u.warnings.map(w => {
                return chalk.bold.yellow(`    — WARN: ${w}`);
            })];
        }

        return changes.join('\n');
    }).join('\n')));

    console.log(`\nCommands running relative to ${chalk.yellow.bold(cwd)}`);

    if (options.dryRun) {
        console.log(chalk.green.bold(`\nNot making any changes.`));
        process.exit(0);
    }

    if (!options.yes) {
        console.log(chalk.yellow.bold(`\nNo changes have been made yet.\n`));
        const resp = await inquirer.prompt([{
            type: 'confirm',
            name: 'persistChanges',
            message: 'Run these changes?',
            default: true,
        }]);
        if (resp.persistChanges === false) {
            console.log(chalk.green.bold(`\nNot making any changes.`));
            process.exit(0);
        }
    }

    console.log(chalk.yellow.bold(`\nRunning the operations. . .\n`));

    upgrades.forEach(u => {
        if (u.newFile) {
            fs.renameSync(u.file, u.newFile);
        };

        if (u.contents) {
            fs.writeFileSync(u.newFile || u.file, u.contents);
        }

        console.log(chalk.greenBright(suppressCwd(`✅ ${u.newFile || u.file}`)));

        if (u.commands && u.commands.length) {
            u.commands.forEach(command => {
                if (options.skipCommands) {
                  console.log(chalk.yellow(`$: skipping ${command} in ${suppressCwd(u.dir)}`));
                  return;
                }
                console.log(chalk.greenBright(`$: ${command} in ${suppressCwd(u.dir)}`));
                try {
                    execSync(command, {
                        cwd: u.dir,
                        stdio: 'inherit'
                    });
                } catch (e) {
                    console.log(chalk.red(`❌ ${command} failed`));
                    console.log(chalk.red(`Cancelling further operations — partial upgrade has occurred`));
                    console.log(chalk.red(`Run this command again after remedying the above error`));
                    process.exit(1);
                }
                console.log(chalk.greenBright(`✅ ${command}`));
            });
        }
    });

    console.log(chalk.green.bold(`\n📚 Done! Your Bookshop has been upgraded to version ${options.version}\n`));

    const warnings = suppressCwd(upgrades.filter(u => u.warnings && u.warnings.length).map(u => {
        return u.warnings.map(w => {
            return chalk.bold.yellow(` WARN: ${w}`);
        }).join('\n');
    }).join('\n'));

    if (warnings) {
        console.log(chalk.yellow(`Done with warnings:`));
        console.log(warnings);
    }
}

run();
