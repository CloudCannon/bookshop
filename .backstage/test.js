const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const packages = require('../bookshop-packages.json');
const env = process.env;

const testNPM = async (pkgs) => {
    const tests = pkgs.map(async (pkg) => {
        return await new Promise((resolve, reject) => {
            try {
                const cmd = `cd ${pkg} && yarn test`;
                console.log(`* ${cmd}`);
                execSync(cmd, { stdio: "ignore", env });
                resolve({ pkg, err: null });
                console.log('* > 👏');
            } catch (err) {
                resolve({ pkg, err });
                console.log('* > ❌');
            }
        });
    });
    return await Promise.all(tests);
}

const testGems = async (pkgs) => {
    const tests = pkgs.map(async (pkg) => {
        return await new Promise((resolve, reject) => {
            try {
                const cmd = `cd ${pkg} && bundle install && bundle exec rake test`;
                console.log(`* ${cmd}`);
                execSync(cmd, { stdio: "ignore", env });
                resolve({ pkg, err: null });
                console.log('* > 👏');
            } catch (err) {
                resolve({ pkg, err });
                console.log('* > ❌');
            }
        });
    });
    return await Promise.all(tests);
}

const test = async () => {
    const npmTestResults = await testNPM(Object.keys(packages.npm));
    const gemTestResults = await testGems(Object.keys(packages.rubygems));
    const testFailures = [...npmTestResults, ...gemTestResults].filter(r => r.err);
    console.log(`🏁`);
    if (testFailures.length) {
        console.error(`* * Unit tests failed for the following packages:`);
        console.error(`* * ⇛ ${testFailures.map(r => r.pkg).join('\n* * ⇛ ')}`);
        console.log(`Cancelling publish.`);
        process.exit(1);
    }
}
test();
