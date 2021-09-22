const path = require('path');
const { exec } = require('child_process');

const runCommand = async (command, fullPath) => {
    return new Promise((resolve, reject) => {
        exec(command, { cwd: fullPath }, () => { resolve() });
    });
}

const run = async() => {
    console.log(`Pre-installing starters/jekyll/Gemfile into starters/jekyll/Gemfile.lock`);
    await runCommand('bundle install', path.join(__dirname, "./features/starters/jekyll"));
    console.log(`Eleventy is pre-installed in the integration-tests folder`);
}

run();