import fs from 'fs';
import path from 'path';
import fastGlob from 'fast-glob';
import chalk from 'chalk';

const cwd = process.cwd();

export const upgradeGem = async (options) => {
    const upgrades = [];

    console.log(chalk.bold(`\nLooking for Gemfiles...`));
    const gemFiles = await fastGlob(`./**/Gemfile*`, {
        cwd,
        dot: !!options.dot
    });

    if (!gemFiles.length) {
        console.log(`None found`);
    }

    const gemRegex = /^2\./.test(options.version)
        ? /gem ['"](jekyll-bookshop|cloudcannon-jekyll-bookshop)['"], ['"](.+)['"]/
        : /gem ['"](jekyll-bookshop)['"], ['"](.+)['"]/;

    for (const gemFile of gemFiles) {
        if (/vendor|node_modules|bundle|\.lock/.test(gemFile)) continue;
        try {
            console.log(`—— Checking ${gemFile}`);
            const contents = fs.readFileSync(gemFile, "utf8");
            let lines = contents.split(/[\r\n]/);
            let update = null;
            let warnings = [];

            const gemLock = path.join(path.dirname(gemFile), `${path.basename(gemFile)}.lock`);
            const gemLockExists = fs.existsSync(gemLock);

            for (let i = 0; i < lines.length; i++) {
                if (!/^2\./.test(options.version) && /cloudcannon-jekyll-bookshop/.test(lines[i])) {
                    warnings.push(`cloudcannon-jekyll-bookshop is referenced in ${gemFile} but does not exist for versions >=3`);
                    warnings.push(`This behavior is now provided by the @bookshop/generate package`);
                    warnings.push(`After running these changes, read the migration docs at https://github.com/CloudCannon/bookshop/blob/main/guides/jekyll.adoc`);
                    console.log(chalk.red(`     ⛔️ ${lines[i].replace(/^\s+/, '')}`));
                }
                if (!gemRegex.test(lines[i])) continue;
                const [dep, pkg, version] = lines[i].match(gemRegex);
                if (version === options.version) {
                    console.log(chalk.greenBright(`     ✅ ${dep}`));
                    if (!update) update = false;
                } else {
                    console.log(chalk.magenta(`     🌟 ${dep} → ${options.version}`));
                    lines[i] = lines[i].replace(version, options.version);
                    update = true;
                }
            }

            if (update) {
                console.log(chalk.magenta(`   🌟 ${gemFile} pending changes`));
                let command = gemLockExists ? `bundle install` : null;
                if (command && path.basename(gemFile) !== "Gemfile") {
                    command = `BUNDLE_GEMFILE="${path.basename(gemFile)}" ${command}`;
                }
                upgrades.push({
                    file: gemFile,
                    contents: lines.join('\n'),
                    commands: command ? [command] : null,
                    warnings,
                });
            } else if (update === false) {
                console.log(chalk.greenBright(`   ✅ ${gemFile}`));
            }
        } catch (e) {
            console.error(chalk.redBright(`Failed to load ${gemFile}`, e));

            const ensureVersionRegex = new RegExp(`jekyll-bookshop.+${options.version}`);

            if (gemLockExists) {
                const contents = fs.readFileSync(gemLock, "utf8");

                if (!ensureVersionRegex.test(contents)) {
                    console.log(chalk.greenBright(`   🌟 ${gemLock} doesn't match ${options.version} — running an install`));
                    let command = `bundle install`;
                    if (path.basename(gemFile) !== "Gemfile") {
                        command = `BUNDLE_GEMFILE="${path.basename(gemFile)}" bundle install`;
                    }
                    upgrades.push({
                        file: gemFile,
                        commands: [command],
                    });
                }
            }
        }
    }

    return upgrades;
}