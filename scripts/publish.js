#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const readline = require('readline');

const packages = require('../bookshop-packages.json');
const ver = process.argv[2];

let env = process.env;

const run = async () => {
    const next = nextVersion(packages.version);
    if (!ver) {
        console.log(box(`Packages are currently @ ${packages.version}
                         Next version looks like ${next}
                         #
                         Use: \`./scripts/publish.js next\` to bump and release
                         Use: \`./scripts/publish.js <ver>\` to release ver
                         #
                         Helpers:
                         \`./scripts/publish.js test\` only runs tests
                         \`./scripts/publish.js git\` updates git tags`));
        process.exit(0);
    }

    let version = ver;
    switch (ver) {
        case 'next':
            version = next;
            break;
        case 'current':
            version = packages.version;
            break;
        case 'vendor':
            console.log(`* Vendoring`);
            env.BOOKSHOP_VERSION = packages.version;
            vendorGems(packages.rubygems, packages.version);
            vendorCustom(packages.custom);
            console.log(`* * Vendoring done`);
            process.exit(0);
        case 'git':
            steps.updateGit(packages.version);
            process.exit(0);
        case 'changelog':
            await steps.changelog(packages.version);
            process.exit(0);
        case 'test':
            console.log(`* Vendoring`);
            vendorGems(packages.rubygems, version);
            vendorCustom(packages.custom);
            console.log(`* * Vendoring done`);

            console.log(`* Running tests`);
            await steps.test(packages);
            console.log(`* * Tests passed`);

            console.log(`* Running integration tests (may take a while)`);
            await steps.integrationTest();
            console.log(`* * Integration tests passed`);
            process.exit(0);
    }
    env.BOOKSHOP_VERSION = version;

    if (!checkVersion(version)) {
        console.error(box(`Invalid version: \`${version}\`
                           Cancelling publish, versions have not been changed.`));
        process.exit(1);
    }
    console.log(box(`Publishing ${version}`));

    steps.ensureReady();

    console.log(`* Setting versions`);
    versionNpm(Object.keys(packages.npm), version);
    versionGems(Object.keys(packages.rubygems), version);
    versionStrings(packages.versionStrings, version);
    console.log(`* * Versions set`);

    packages.version = version;
    fs.writeFileSync(path.join(__dirname, '../bookshop-packages.json'), JSON.stringify(packages, null, 2));
    console.log(`* * bookshop-packages.json updated`);

    // console.log(`* Vendoring`);
    // env.PUBLISH_BOOKSHOP_CDN = true;
    // vendorGems(packages.rubygems, version);
    // vendorCustom(packages.custom);
    // console.log(`* * Vendoring done`);

    // console.log(`* Running unit tests`);
    // await steps.test(packages);
    // console.log(`* * Unit tests passed`);

    // console.log(`* Running integration tests (may take a while)`);
    // await steps.integrationTest();
    // console.log(`* * Integration tests passed`);

    // console.log(`* Updating changelog`);
    // await steps.changelog();

    console.log(`* Publishing packages`);
    const yn = await question(`Publish? y / n: `);
    if (yn !== 'y') {
        process.exit(1);
    }

    // console.log(`* * Publishing...`);
    // const npmPublishResults = await publishNPM(Object.keys(packages.npm), version);
    // const gemPublishResults = await publishGems(Object.keys(packages.rubygems), version);
    // const publishFailures = [...npmPublishResults, ...gemPublishResults].filter(r => r.err).map(r => r.pkg);
    // const publishSuccesses = [...npmPublishResults, ...gemPublishResults].filter(r => !r.err).map(r => `${pad(`[${r.version}]`, 30)} ${r.pkg}`);

    // if (publishFailures.length) {
    //     console.error(`* * Publishing failed for the following packages:`);
    //     console.error(`* * ⇛ ${publishFailures.join('\n* * ⇛ ')}`);
    //     console.error(`* * The following packages __have__ been published:`);
    //     console.error(`* * ⇛ ${publishSuccesses.join('\n* * ⇛ ')}`);
    //     console.log(`\n` + box(`Publishing hit an error. Versions have been changed.
    //                      To re-run this publish, use \`./publish.js current\``));
    //     process.exit(1);
    // }

    if (/-|[a-z]/.test(version)) {
        Object.entries(packages.custom).forEach(([directory]) => {
            if (/\.\./.test(directory)) return;
            const target = path.join(__dirname, '../', directory);
            execSync(`git add ${target}`, { stdio: "inherit", env });
        });

        console.log(`* This looks like a prerelease.`);
        console.log(`* Git tags will be needed for Hugo, but other version changed shouldn't be published.`);
        console.log(`* Discard all changes now, except for the staged version files, and then continue to push the tags.`);
        console.log(`* Commit & push changes to git?`);
        const yn = await question(`Discarded changes? y / n: `);
        if (yn === 'y') steps.updateGit(version);
    } else {
        console.log(`* Commit & push changes to git?`);
        const yn = await question(`y / n: `);
        if (yn === 'y') steps.updateGit(version);
    }

    console.log(`\n` + box(`All packages published:
                     ⇛ ${publishSuccesses.join('\n⇛ ')}`));
}

const steps = {
    ensureReady: async () => {
        // const gitStatus = execSync('git status --porcelain', { stdio: "pipe", env });
        // if (gitStatus.toString().length) {
        //     console.error(box(`Git is dirty. Please commit or stash your changes first.`));
        //     process.exit(1);
        // }
    },
    test: async (packages) => {
        process.stdout.write(`* * `);
        const npmTestResults = await testNPM(Object.keys(packages.npm));
        const gemTestResults = await testGems(Object.keys(packages.rubygems));
        const testFailures = [...npmTestResults, ...gemTestResults].filter(r => r.err);
        console.log(`🏁`);
        if (testFailures.length) {
            console.error(`* * Unit tests failed for the following packages:`);
            console.error(`* * ⇛ ${testFailures.map(r => r.pkg).join('\n* * ⇛ ')}`);
            console.log(box(`Cancelling publish, package versions have been changed.
                             
                             Discard unstaged changes and re-run
                             whatever command you used to publish.`));
            process.exit(1);
        }
    },
    integrationTest: async () => {
        process.stdout.write(`* * `);
        const testResult = await new Promise((resolve, reject) => {
            try {
                execSync(`cd javascript-modules/integration-tests && yarn run itest`, { stdio: "ignore", env });
                resolve({ err: null });
                console.log(' 🎉');
            } catch (err) {
                resolve({ err });
                console.log(' 😦');
            }
        });
        if (testResult.err) {
            console.error(`* * Integration tests failed!`);
            console.error(`* * Failing command: "cd javascript-modules/integration-tests && yarn run itest"`);
            console.log(box(`Cancelling publish, package versions have been changed.
                             
                             Discard unstaged changes and re-run
                             whatever command you used to publish.`));
            process.exit(1);
        }
    },
    changelog: async () => {
        console.log(`* Build a changelog?`);
        const yn = await question(`y / n: `);
        if (yn === 'y') {
            console.log(execSync(`npx conventional-changelog -i CHANGELOG.md -s --pkg javascript-modules/browser/package.json -p angular`, { env }).toString());
            console.log(`* * Updated changelog, pleace check the staged changes before you continue.`);
        } else {
            console.log(`* * Skipping changelog.`);
        }
    },
    updateGit: async (version) => {
        console.log(`* * Updating git`);
        execSync(`git add -A && git commit -m "build: releasing ${version}"`, { env });
        execSync(`git tag -a v${version} -m "build: releasing ${version}"`, { env });
        execSync(`git tag -a hugo/v${version} -m "build: releasing ${version}"`, { env });
        execSync(`git push && git push --tags`, { env });
        console.log(`* * * Git updated`);
    }
}

/**
 * Testing functions
 */
const testNPM = async (pkgs) => {
    const tests = pkgs.map(async (pkg) => {
        return await new Promise((resolve, reject) => {
            if (/cloudcannon-eleventy-bookshop/.test(pkg)) {
                process.stdout.write('⏭️ ');
                return resolve({ pkg, err: null });
            }
            try {
                execSync(`cd ${pkg} && yarn test`, { stdio: "ignore", env });
                resolve({ pkg, err: null });
                process.stdout.write('👏 ');
            } catch (err) {
                resolve({ pkg, err });
                process.stdout.write('❌ ');
            }
        });
    });
    return await Promise.all(tests);
}

const testGems = async (pkgs) => {
    const tests = pkgs.map(async (pkg) => {
        return await new Promise((resolve, reject) => {
            if (/cloudcannon-jekyll-bookshop/.test(pkg)) {
                process.stdout.write('⏭️ ');
                return resolve({ pkg, err: null });
            }
            try {
                execSync(`cd ${pkg} && bundle exec rake test`, { stdio: "ignore", env });
                resolve({ pkg, err: null });
                process.stdout.write('👏 ');
            } catch (err) {
                resolve({ pkg, err });
                process.stdout.write('❌ ');
            }
        });
    });
    return await Promise.all(tests);
}

/**
 * Publishing functions
 */
const publishNPM = async (pkgs, version) => {
    const npmTag = getPrereleaseTag(version) ? ` --tag ${getPrereleaseTag(version)}` : ``;
    const releases = pkgs.map(async (pkg) => {
        return await new Promise((resolve, reject) => {
            try {
                const cmd = `yarn --cwd ${pkg} publish${npmTag} --non-interactive --access public`;
                console.log(`\n$: ${cmd}`);
                execSync(cmd, { stdio: "inherit", env });
                resolve({ pkg, version, err: null });
            } catch (err) {
                resolve({ pkg, err });
            }
        });
    });
    return await Promise.all(releases);
};

const publishGems = async (pkgs, version) => {
    const gemVersion = formatGemVersion(version);
    const releases = pkgs.map(async (pkg) => {
        return await new Promise((resolve, reject) => {
            try {
                const packageName = path.basename(pkg);
                let cmd = `gem build ${pkg}/${packageName}.gemspec`;
                console.log(`\n$: ${cmd}`);
                execSync(cmd, { stdio: "inherit", env })
                cmd = `gem push ${pkg}/${packageName}-${gemVersion}.gem`;
                console.log(`\n$: ${cmd}`);
                execSync(cmd, { stdio: "inherit", env })
                execSync(`rm ${pkg}/*.gem`, { env });
                resolve({ pkg, version: gemVersion, err: null });
            } catch (err) {
                resolve({ pkg, err });
            }
        });
    });
    return await Promise.all(releases);
};


/**
 * Version bumping functions
 */
const checkVersion = ver => /^\d+\.\d+\.\d+(-[a-z]+\.\d+)?$/.test(ver);
const getPrereleaseTag = ver => ver.match(/^\d+\.\d+\.\d+(?:-([a-z]+)\.\d+)$/)?.[1];

const versionNpm = (pkgs, version) => {
    pkgs.forEach(pkg => {
        const npmBump = execSync(`npm --prefix ${pkg} version ${version} --allow-same-version --no-git-tag-version --no-commit-hooks`, { env });
        if (npmBump.stderr) {
            console.error(box(`yarn version bump failed:
                               ${npmBump.stderr}`));
            process.exit(1);
        }
    });
    execSync(`cd javascript-modules && yarn up '@bookshop/*@${version}'`, { env });
};

const formatGemVersion = (ver) => ver.replace(/-/, '.pre.');
const versionGems = (gems, version) => {
    gems.forEach(gem => {
        const packageName = path.basename(gem);
        const packageVersionFile = path.join(__dirname, '../', gem, `lib/${packageName}/version.rb`);
        let versionFileContents = fs.readFileSync(packageVersionFile, 'utf8');
        if (!/VERSION/.test(versionFileContents)) {
            console.error(box(`${packageName} version.rb file does not contain a VERSION constant.`));
            process.exit(1);
        }

        versionFileContents = versionFileContents
            .replace(/VERSION =.*$/gm, `VERSION = "${formatGemVersion(version)}"`);
        fs.writeFileSync(packageVersionFile, versionFileContents);
    });
};

const versionStrings = (files, version) => {
    Object.entries(files).forEach(([file, { regex, replacement }]) => {
        let fileContents = fs.readFileSync(path.join(__dirname, '../', file), 'utf8');
        let r = new RegExp(regex, 'g');
        let new_text = replacement.replace(/NEW_VERSION/g, version);
        fileContents = fileContents.replace(r, new_text);
        fs.writeFileSync(file, fileContents);
    })
}

const nextVersion = (ver) => {
    return ver.replace(/\d+$/, (m) => parseInt(m) + 1);
}

/**
 * Vendoring functions
 */
// TODO: async & error handling
const vendorGems = async (gems, version) => {
    Object.entries(gems).forEach(([gem, opts]) => {
        const target = path.join(__dirname, '../', gem);
        if (opts.vendor_from_npm && opts.vendor_from_npm.length) {
            fs.rmSync(`${target}/node_modules`, { recursive: true, force: true });
            opts.vendor_from_npm.forEach(packageName => {
                const pkg = path.join(process.cwd(), packageName);
                fs.mkdirSync(`${target}/node_modules/@bookshop/${path.basename(pkg)}`, { recursive: true });
                execSync(`cd ${pkg} && yarn pack`, { env });
                execSync(`cd ${pkg} && tar -Pxzf package.tgz`, { env });
                recursiveCopy(`${pkg}/package/`, `${target}/node_modules/@bookshop/${path.basename(pkg)}/`);
                fs.rmSync(`${pkg}/package`, { recursive: true });
                fs.rmSync(`${pkg}/package.tgz`);
            });
        }
    });
};

const vendorCustom = async (directories) => {
    console.log(`* * Vendoring custom directories`);
    Object.entries(directories).forEach(([directory, opts]) => {
        if (/\.\./.test(directory)) return;
        const target = path.join(__dirname, '../', directory);
        if (opts.commands && opts.commands.length) {
            opts.commands.forEach(command => {
                if (/\.\./.test(command)) return;
                if (/-rf|-fr/.test(command)) return;
                cmd = `cd ${target} && ${command}`;
                console.log(`\n$: ${cmd}`);
                execSync(cmd, { stdio: "inherit", env })
            });
        }
    });
};

/**
 * I/O utilities:
 **/
const recursiveCopy = (from, to) => {
    fs.readdirSync(from).forEach(el => {
        console.log(el);
        if (fs.lstatSync(path.join(from, el)).isFile()) {
            fs.copyFileSync(path.join(from, el), path.join(to, el));
        } else {
            recursiveCopy(path.join(from, el), path.join(to, el));
        }
    });
}
const trim = (str) => str.replace(/^\s+|\s+$/gm, '').replace(/^#$/gm, '');
const pad = (str, len) => {
    len = len > 0 ? len : 1;
    return str + Array(len - str.length + 1).join(' ')
};
const box = (str) => {
    let lines = trim(str).split('\n');
    const max = lines.reduce((a, b) => a.length > b.length ? a : b);
    lines = lines.map((l) => {
        return `║ ${l + Array(max.length - l.length + 1).join(' ')} ║`;
    });
    lines.unshift(`╔═${max.replace(/./g, '═')}═╗`);
    lines.push(`╚═${max.replace(/./g, '═')}═╝`);
    return lines.join('\n');
}


const question = async (q) => {
    return await new Promise((resolve, reject) => {
        try {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });
            rl.question(q, (answer) => {
                resolve(answer);
                rl.close();
            });
        } catch (err) {
            reject(err);
        }
    });
}

run();
