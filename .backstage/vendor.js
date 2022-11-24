const path = require('path');
const fs = require('fs');
const execSync = require('child_process').execSync;

const packages = require('../bookshop-packages.json');
const env = process.env;

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

vendorCustom(packages.custom);
