#!/usr/bin/env node

const execSync = require("child_process").execSync;
const ora = require("ora");
const download = require("download-git-repo");
const path = require("path");

const { Command } = require("commander");
const program = new Command();

/**
 * A CLI package to help init a bookshop package
 */
async function run() {

  program.option("--init <dir>", "Make a new bookshop component library");
  program.parse(process.argv);

  const spinner = ora("Downloading bookshop...").start();

  await new Promise((resolve) =>
    download(
      "CloudCannon/bookshop",
      path.resolve(__dirname, "temp"),
      {},
      resolve
    )
  );

  const output = `${program.init || "."}`;

  // Copy the example project into user's specified directory
  try {
    execSync(`cp -r ${__dirname}/temp/examples/example-bookshop/ ${output}`);
  } catch (ex) {
    console.error(`Command failed! ${ex}`);
    execSync(`rm -rf ${__dirname}/temp`);
    process.exit(1);
  }

  spinner.text = "Removing temp directory...";
  execSync(`rm -rf ${__dirname}/temp`);

  spinner.stop();

  console.log("Finished");
}

run();
