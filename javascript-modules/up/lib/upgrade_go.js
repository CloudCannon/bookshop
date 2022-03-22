import fs from 'fs';
import fastGlob from 'fast-glob';
import chalk from 'chalk';

const cwd = process.cwd();
const goRegex = /github.com\/cloudcannon\/bookshop\/hugo\/v(\d) v(\S+)/

export const upgradeGo = async (options) => {
    const upgrades = [];

    console.log(chalk.bold(`\nLooking for go modules...`));
    const goModuleFiles = await fastGlob(`./**/go.mod`, {
        cwd,
        dot: !!options.dot
    });

    if (!goModuleFiles.length) {
        console.log(`None found`);
    }

    for (const goModuleFile of goModuleFiles) {
        if (/vendor|node_modules/.test(goModuleFile)) continue;
        try {
            console.log(`—— Checking ${goModuleFile}`);
            const contents = fs.readFileSync(goModuleFile, "utf8");
            const lines = contents.split(/[\r\n]/);
            let update = null;

            for (const line of lines) {
                if (!goRegex.test(line)) continue;
                const [dep, base, version] = line.match(goRegex);
                if (version === options.version) {
                    console.log(chalk.greenBright(`     ✅ ${dep}`));
                    update = false;
                    break;
                } else {
                    console.log(chalk.magenta(`     🌟 ${dep} → v${options.version}`));
                    update = true;
                    break;
                }
            }

            if (update) {
                console.log(chalk.magenta(`   🌟 ${goModuleFile} pending changes`));
                upgrades.push({
                    file: goModuleFile,
                    commands: [
                        `hugo mod tidy`,
                        `hugo mod get github.com/cloudcannon/bookshop/hugo/v${options.version.split('.')[0]}@v${options.version}`,
                        `hugo mod tidy`
                    ],
                });
            } else if (update === false) {
                console.log(chalk.greenBright(`   ✅ ${goModuleFile}`));
            }
        } catch (e) {
            console.error(chalk.redBright(`Failed to load ${goModuleFile}`, e));
        }
    }

    return upgrades;
}