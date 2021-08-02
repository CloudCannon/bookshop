#! /usr/bin/env node

const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;
const readline = require('readline');

const packages = require('../bookshop-packages.json');

const run = async () => {

    console.log(`* Running tests`);
    await steps.test(packages);
    console.log(`* * Tests passed`);

}

const steps = {
    test: async (packages) => {
        process.stdout.write(`* * `);
        const npmTestResults = await testNPM(Object.keys(packages.npm));
        const testFailures = npmTestResults.filter(r => r.err);
        console.log(`🏁`);
        if (testFailures.length) {
            console.error(`* * Tests failed for the following packages:`);
            console.error(`* * ⇛ ${testFailures.map(r => r.pkg).join('\n* * ⇛ ')}`);
            process.exit(1);
        }
    }
}

/**
 * Testing functions
 */
const testNPM = async (pkgs) => {
    let cmd = `rm -rf javascript-modules/node_modules`;
    console.log(`\n* * $:${cmd}`);
    execSync(cmd, {stdio: "ignore"});

    const tests = pkgs.map(async (pkg) => {

        return await new Promise((resolve, reject) => {
            try {
                let cmd = `cd ${pkg} && npm install`;
                console.log(`\n* * $: ${cmd}`);
                execSync(cmd, {stdio: "ignore"});

                cmd = `cd ${pkg} && npm test`;
                process.stdout.write(`* * $: ${cmd} `);
                execSync(cmd, {stdio: "ignore"});

                execSync(`cd ${pkg} && rm -rf node_modules && rm -f package-lock.json`, {stdio: "ignore"});

                resolve({pkg, err: null});
                console.log('👏');
            } catch (err) {
                resolve({pkg, err});
                console.log('❌');
            }
        });
    });
    return await Promise.all(tests);
}

/**
 * I/O utilities:
 **/
const trim = (str) => str.replace(/^\s+|\s+$/gm, '');
const pad = (str, len) => str + Array(len - str.length + 1).join(' ');
const box = (str) => {
    let lines = trim(str).split('\n');
    const max = lines.reduce((a,b) => a.length > b.length ? a : b);
    lines = lines.map((l) => {
        return `║ ${l + Array(max.length - l.length + 1).join(' ')} ║`;
    });
    lines.unshift(`╔═${max.replace(/./g, '═')}═╗`);
    lines.push(`╚═${max.replace(/./g, '═')}═╝`);
    return lines.join('\n');
}

run();
