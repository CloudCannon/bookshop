const path = require('path');
const { exec } = require('child_process');
const fs = require('fs');

const runCommand = async (command, fullPath, env) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: fullPath, env: { ...process.env, ...env } }, (e) => {
            if (e) {
                console.error(e);
                process.exit(1);
            }
            resolve();
        });
    });
}

const run = async () => {
    console.log(`Cleaning any old tests`);
    try {
        fs.rmdirSync(path.join(__dirname, './.bookshop-tmp-test-dir'), { recursive: true, force: true });
    } catch (e) {}
    console.log(`Pre-installing Jekyll Gemfile(s)`);
    await runCommand('bundle install', path.join(__dirname, "./support/starters/jekyll"));
    await runCommand('bundle install', path.join(__dirname, "./support/starters/jekyll"), { 'BUNDLE_GEMFILE': 'Gemfile.cloudcannon' });
    console.log(`Eleventy is pre-installed in the integration-tests folder`);
    console.log(`Hugo should be pre-installed on the system`);
}

run();