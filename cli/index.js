#!/usr/bin/env node

const execSync = require("child_process").execSync;
const util = require("util");
const meow = require("meow");
const ora = require('ora');


const cli = meow(`
    Usage
      $ npx bookshop init <output-dir>
 
    Examples
      $ npx bookshop init .
`);

const spinner = ora('Initializing bookshop...').start();

// Copy the example project into user's specified directory
execSync(`cp -r ${__dirname}/../examples/example-bookshop/ ${cli.input || "."}`);

spinner.stop();

console.log('Finished');
