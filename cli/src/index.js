#!/usr/bin/env node

const { spawn, execSync, execFileSync } = require("child_process");
const os = require("os");
const ora = require("ora");
const download = require("download-git-repo");
const path = require("path");
const fs = require("fs");
const shell = require("shelljs");

const { Command } = require("commander");
const { exit, stdin } = require("process");
const program = new Command();

// const REPO_ADDRESS = `CloudCannon/bookshop/examples/example-bookshop-kickstart/`;

/**
 * Execute a bash command and give feedback to console
 *
 * @param {string} command
 */
async function executeCommandWithLogging(command) {
  return new Promise((resolve, reject) => {
    // Make parts into a command readable by spawn
    const parts = command.split(" ");
    console.log(command);
    const child = spawn(parts[0], parts.slice(1));

    // child.stdout.pipe(process.stdout);
    // child.stderr.pipe(process.stderr);

    // Handlers

    child.stdout.on("data", (data) => {
      console.log(data.toString());
    });

    child.stderr.on("error", (error) => {
      console.error(error.toString());
    });

    child.on("data", (data) => {
      console.log(data.toString());
    });

    child.on("error", (error) => {
      reject(`${error.name}: ${error.message} ${error.description}`);
    });

    child.on("close", (status) => {
      resolve();
    });
  });
}

/**
 * A CLI package to help init a bookshop package
 */
async function run() {
  program.option("--init <dir>", "Make a new bookshop component library");
  program.option(
    "--templatePath <dir>",
    "Optional: specify a custom path for the starter"
  );
  program.parse(process.argv);

  const templatePath =
    program.templatePath ||
    `https://github.com/CloudCannon/bookshop -s examples/example-bookshop-kickstart`;

  console.log(templatePath);

  // await new Promise((resolve) =>
  //   download(
  //     "CloudCannon/bookshop",
  //     path.resolve(__dirname, "temp"),
  //     {},
  //     resolve
  //   )
  // );

  // const output = `${program.init || "."}`;

  // // Copy the example project into user's specified directory
  // try {
  //   execSync(`cp -r ${__dirname}/temp/examples/example-bookshop/ ${output}`);
  // } catch (ex) {
  //   console.error(`Command failed! ${ex}`);
  //   execSync(`rm -rf ${__dirname}/temp`);
  //   process.exit(1);
  // }

  // spinner.stop();

  // TODO: add `brew install rust` if user doesn't have it

  if (os.type() !== "Darwin") {
    console.error(
      "This script is currently only available on MacOS. Please see documentation for help."
    );
    exit(1);
  }

  const spinner = ora("Installing kickstart...").start();

  try {
    // Test whether user has Rust. If not, install
    if (!fs.existsSync(`~/.cargo/bin`)) {
      spinner.text = "Installing Rust...";
      await shell.exec(`brew install rust`);
    }

    spinner.text = "Installing kickstart...";
    await shell.exec(`cargo install kickstart`);

    spinner.text = "Kickstarting project...";
    spinner.stop();

    // Run kickstart command
    await new Promise((resolve) => {
      const proc = shell.exec(`~/.cargo/bin/kickstart ${templatePath} --output-dir ${path.resolve(".")}`, {
        async: true,
      });
      // Pipe user input to kickstart
      stdin.pipe(proc.stdin);
      proc.on("exit", () => {
        resolve();
      });
    });
  } catch (err) {
    console.error(err);
    exit(1);
  }

  // spinner.stop();
  console.log("Finished");
  exit(0);
}

run();
