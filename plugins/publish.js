#! /usr/bin/env node

const fs = require('fs');
const execSync = require('child_process').execSync;

let dirs = execSync('ls -d */').toString();

dirs = dirs.split('\n').filter(dir => /[a-z]/.test(dir)).map(dir => dir.replace(/\/$/, ''));
console.log(`Publishing ${dirs.join(', ')}`);

let version = null;
dirs.forEach(dir => {
    const file = fs.readFileSync( `${dir}/lib/${dir}/version.rb` );
    const pkgMatch = file.toString().match(/VERSION = "(.*)"/);
    const pkgVer = pkgMatch ? pkgMatch[1] : "UNKNOWN";
    if (version && pkgVer !== version) {
        console.error(`Packages must be published at the same version.\n${version} !== ${pkgVer}`);
        process.exit(1);
    }
    version = pkgVer;
});

console.log(`Build at ${version}`);
console.log(`- - - - - - - - - - - -`);

dirs.forEach(dir => {
    console.log(`Building ${dir}/${dir}.gemspec`);
    const buildResp = execSync(`gem build ${dir}/${dir}.gemspec`);
    console.log(buildResp.toString());
});

console.log(`Publishing at ${version}`);
console.log(`- - - - - - - - - - - -`);

dirs.forEach(dir => {
    try {
        console.log(`Publishing ${dir}/${dir}-${version}.gem`);
        const publishResp = execSync(`gem push ${dir}/${dir}-${version}.gem`);
        console.log(publishResp.toString());
    } catch (e) {
        console.error(`Publishing failed. \n${e}\nVersion probably exists.`);
    }
});

console.log(`Cleaning house`);
console.log(`- - - - - - - - - - - -`);

dirs.forEach(dir => {
    execSync(`rm ${dir}/${dir}*.gem`);
});

console.log(`All done :)`);