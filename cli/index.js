#!/usr/bin/env node

const execSync = require("child_process").execSync;
const meow = require("meow");
const ora = require("ora");
const download = require("download-git-repo");
const path = require("path");

/**
 * A CLI package to help init a bookshop package
 */
async function run() {
  const cli = meow(`
    Usage
      $ npx bookshop init <output-dir>
 
    Examples
      $ npx bookshop init .
`);

  const spinner = ora("Downloading bookshop...").start();

  await new Promise((resolve) =>
    download(
      "CloudCannon/bookshop",
      path.resolve(__dirname, "temp"),
      {},
      resolve
    )
  );

  // Copy the example project into user's specified directory
  execSync(
    `cp -r ${__dirname}/temp/examples/example-bookshop/ ${cli.input || "."}`
  );

  spinner.text = "Removing temp directory...";
  execSync(`rm -rf ${__dirname}/temp`);

  spinner.stop();

  console.log("Finished");
}

run();
