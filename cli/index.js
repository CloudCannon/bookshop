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
      $ npx bookshop --init <output-dir>
 
    Examples
      $ npx bookshop --init .
  `, {
    flags: {
      init: {
        isRequired: true
      }
    }
  });

  const spinner = ora("Downloading bookshop...").start();

  await new Promise((resolve) =>
    download(
      "CloudCannon/bookshop",
      path.resolve(__dirname, "temp"),
      {},
      resolve
    )
  );

  const output = `${cli.flags.init || "."}`;

  // Copy the example project into user's specified directory
  try {
  execSync(
    `cp -r ${__dirname}/temp/examples/example-bookshop/ ${output}`
  );
  } catch (ex) {
    console.error(`Command failed! ${ex}`);
    process.exit(1);
  }

  spinner.text = "Removing temp directory...";
  execSync(`rm -rf ${__dirname}/temp`);

  spinner.stop();

  console.log("Finished");
}

run();
