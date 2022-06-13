import fs from 'fs';
import path from 'path';
import fastGlob from 'fast-glob';
import chalk from 'chalk';

import TOML from '@ltd/j-toml';

const cwd = process.cwd();

export const upgradeBookshopModule = async (options) => {
    const upgrades = [];

    if (options.skipMigrations) {
        console.log(chalk.gray("Skipping Bookshop Hugo module migrations."));
        return upgrades;
    }

    const bookshopConfigs = await fastGlob(`./**/bookshop/bookshop.config.*`, {
        cwd,
        dot: !!options.dot
    });

    for (const bookshopConfig of bookshopConfigs) {
        let bookshopRoot = path.dirname(path.dirname(bookshopConfig));
        let bookshopModuleFile = path.join(bookshopRoot, "config.toml");
        try {
            if (fs.existsSync(bookshopModuleFile)) {
                let rawContents = fs.readFileSync(bookshopModuleFile, "utf8");
                let contents = TOML.parse(rawContents, 1.0, '\n', false);
                let dirty = false;
                let mounts = contents?.module?.mounts;

                if (Array.isArray(mounts)) {
                    for (let mount of mounts) {
                        if (mount.target === "layouts/partials/bookshop") {
                            mount.includeFiles = ["**/*.hugo.html"];
                            dirty = true;
                            console.log(chalk.greenBright(`🌟 Adding includeFiles config to Hugo Bookshop module`));
                        }
                    }
                }

                if (dirty) {
                    upgrades.push({
                        file: bookshopModuleFile,
                        contents: TOML.stringify(contents, {
                            newline: '\n',
                            indent: 2,
                            newlineAround: 'section',
                            xNull: true,
                        }),
                    });
                }

            }
        } catch (e) {
            console.warn(chalk.yellow.bold(`ERROR: Couldn't parse ${bookshopModuleFile}`, e));
            process.exit(1);
        }
    }

    return upgrades;
}