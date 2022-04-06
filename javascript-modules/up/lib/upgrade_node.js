import fs from 'fs';
import path from 'path';
import fastGlob from 'fast-glob';
import chalk from 'chalk';

const cwd = process.cwd();

const iterateDeps = (deps, options, warnings, filename) => {
    if (typeof deps !== "object") return null;
    let updates = null;
    for (const [dep, ver] of Object.entries(deps || {})) {
        if (/^@bookshop\//.test(dep)) {
            if (!/^2\./.test(options.version) && /cloudcannon/.test(dep)) {
                warnings.push(`${dep} is referenced in ${filename} but does not exist for versions >=3`);
                warnings.push(`This behavior is now provided by the @bookshop/generate package`);
                warnings.push(`After running these changes, read the migration docs at https://github.com/CloudCannon/bookshop/blob/main/guides/eleventy.adoc`);
                console.log(chalk.red(`     ⛔️ ${dep} ${ver}`));
                if (!updates) updates = false;
            } else if (ver === options.version) {
                console.log(chalk.greenBright(`     ✅ ${dep} ${ver}`));
                if (!updates) updates = false;
            } else {
                console.log(chalk.magenta(`     🌟 ${dep} ${ver} → ${options.version}`));
                deps[dep] = options.version;
                updates = true;
            }
        }
    }
    return updates;
}

export const upgradeNode = async (options) => {
    const upgrades = [];
    const warnings = [];

    console.log(chalk.bold(`\nLooking for node packages...`));
    const nodePackageFiles = await fastGlob(`./**/package.json`, {
        cwd,
        dot: !!options.dot
    });

    if (!nodePackageFiles.length) {
        console.log(`None found`);
    }

    for (const nodePackageFile of nodePackageFiles) {
        if (/node_modules/.test(nodePackageFile)) continue;
        try {
            console.log(`—— Checking ${nodePackageFile}`);

            const yarnLock = path.join(path.dirname(nodePackageFile), `yarn.lock`);
            const pkgLock = path.join(path.dirname(nodePackageFile), `package-lock.json`);
            const yarnLockExists = fs.existsSync(yarnLock);
            const pkgLockExists = fs.existsSync(pkgLock);

            const contents = fs.readFileSync(nodePackageFile, "utf8");
            const parsedModule = JSON.parse(contents);
            let updates = [
                iterateDeps(parsedModule.dependencies, options, warnings, nodePackageFile),
                iterateDeps(parsedModule.devDependencies, options, warnings, nodePackageFile),
                iterateDeps(parsedModule.optionalDependencies, options, warnings, nodePackageFile),
                iterateDeps(parsedModule.peerDependencies, options, warnings, nodePackageFile),
            ].some(f => f);
            if (updates) {
                console.log(chalk.magenta(`   🌟 ${nodePackageFile} pending changes`));
                const command = yarnLockExists ? `yarn install` : pkgLockExists ? `npm i` : null;
                if (!command) warnings.push(`Didn't detect yarn or npm locks for ${nodePackageFile}. Not running any installation command.`);
                upgrades.push({
                    file: nodePackageFile,
                    contents: JSON.stringify(parsedModule, null, 2),
                    commands: command ? [command] : null,
                    warnings,
                });
            } else if (updates === false) {
                console.log(chalk.greenBright(`   ✅ ${nodePackageFile}`));

                const ensureVersionRegex = new RegExp(`@bookshop/.+${options.version}`);

                if (yarnLockExists) {
                    const contents = fs.readFileSync(yarnLock, "utf8");

                    if (!ensureVersionRegex.test(contents)) {
                        console.log(chalk.greenBright(`   🌟 ${yarnLock} doesn't match ${options.version} — running an install`));
                        upgrades.push({
                            file: nodePackageFile,
                            commands: [`yarn install`],
                        });
                    }
                }

                if (pkgLockExists) {
                    const contents = fs.readFileSync(pkgLock, "utf8");

                    if (!ensureVersionRegex.test(contents)) {
                        console.log(chalk.greenBright(`   🌟 ${pkgLock} doesn't match ${options.version} — running an install`));
                        upgrades.push({
                            file: nodePackageFile,
                            commands: [`npm i`],
                        });
                    }
                }
            }
        } catch (e) {
            console.error(chalk.redBright(`Failed to load ${nodePackageFile}`, e));
        }
    }

    return upgrades;
}
