const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const packages = require('../bookshop-packages.json');
const ver = process.argv[2];
const wet = process.argv[3];
const env = process.env;

const getPrereleaseTag = ver => ver.match(/^\d+\.\d+\.\d+(?:-([a-z]+)\.\d+)$/)?.[1];
const formatGemVersion = ver => ver.replace(/-/, '.pre.');

const publishNPM = async (pkgs, version) => {
    const npmTag = getPrereleaseTag(version) ? ` --tag ${getPrereleaseTag(version)}` : ``;
    const releases = pkgs.map(async (pkg) => {
        return await new Promise((resolve, reject) => {
            try {
                const cmd = `yarn --cwd ${pkg} publish${npmTag} --non-interactive --access public`;
                console.log(`* ${cmd}`);
                if (wet === "seriously") execSync(cmd, { stdio: "inherit", env });
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
                console.log(`* ${cmd}`);
                if (wet === "seriously") execSync(cmd, { stdio: "inherit", env })
                cmd = `gem push ${pkg}/${packageName}-${gemVersion}.gem`;
                console.log(`* ${cmd}`);
                if (wet === "seriously") execSync(cmd, { stdio: "inherit", env })
                if (wet === "seriously") execSync(`rm ${pkg}/*.gem`, { env });
                resolve({ pkg, version: gemVersion, err: null });
            } catch (err) {
                resolve({ pkg, err });
            }
        });
    });
    return await Promise.all(releases);
};

if (!ver) {
    console.error(`No version supplied`);
    process.exit(1);
}

if (wet === "true") {
    console.log("Pushing packages for real");
} else {
    console.log("Doing a dry run publish");
    console.log("Pass `seriously` after version to publish for real.\n");
}

const publish = async () => {
    const npmPublishResults = await publishNPM(Object.keys(packages.npm), ver);
    const gemPublishResults = await publishGems(Object.keys(packages.rubygems), ver);
    const publishFailures = [...npmPublishResults, ...gemPublishResults].filter(r => r.err).map(r => r.pkg);
    const publishSuccesses = [...npmPublishResults, ...gemPublishResults].filter(r => !r.err).map(r => `${r.version} ${r.pkg}`);

    if (publishFailures.length) {
        console.error(`* * Publishing failed for the following packages:`);
        console.error(`* * ⇛ ${publishFailures.join('\n* * ⇛ ')}`);
        console.error(`* * The following packages __have__ been published:`);
        console.error(`* * ⇛ ${publishSuccesses.join('\n* * ⇛ ')}`);
        if (publishSuccesses.length) {
            // Since publishing partly succeeded we want to continue to update the git info
            // (so that we can re-run this publish to try mop up missing packages)
            process.exit(0);
        } else {
            process.exit(1);
        }
    }
}

publish();