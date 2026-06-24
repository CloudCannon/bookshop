const path = require('path');
const fs = require('fs');
const spawnSync = require('child_process').spawnSync;

const packages = require('../bookshop-packages.json');
const env = process.env;

const ALLOWED_COMMANDS = ['npm', 'yarn', 'pnpm', 'npx'];

const vendorCustom = async (directories) => {
    console.log(`* * Vendoring custom directories`);
    Object.entries(directories).forEach(([directory, opts]) => {
        if (/\.\./.test(directory)) return;
        const target = path.join(__dirname, '../', directory);
        if (opts.commands && opts.commands.length) {
            opts.commands.forEach(command => {
                if (/\.\./.test(command)) return;
                if (/-rf|-fr/.test(command)) return;
                const parts = command.trim().split(/\s+/);
                if (!ALLOWED_COMMANDS.includes(parts[0])) return;
                console.log(`\n$: ${command} (in ${target})`);
                spawnSync(parts[0], parts.slice(1), { cwd: target, stdio: "inherit", env, shell: false });
            });
        }
    });
};

vendorCustom(packages.custom);
