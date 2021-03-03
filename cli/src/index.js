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

  if (os.type() !== "Darwin") {
    console.error(
      "This script is currently only available on MacOS. Please see documentation for help."
    );
    exit(1);
  }

  const spinner = ora("Installing kickstart...").start();

  try {
    // Test whether user has Rust. If not, install
    if (!fs.existsSync(path.resolve(os.homedir(), `.cargo/bin`))) {
      spinner.stop();

      console.error(
        `Please install rust (e.g. \`brew install rust\`) before running this command.`
      );
      exit(1);
    }

    if (!fs.existsSync(path.resolve(os.homedir(), `.cargo/bin/kickstart`))) {
      spinner.text = "Installing kickstart...";
      shell.exec(`cargo install kickstart`);
    }

    spinner.text = "Kickstarting project...";
    spinner.stop();

    // Run kickstart command
    await new Promise((resolve) => {
      const proc = shell.exec(
        `~/.cargo/bin/kickstart ${templatePath} --output-dir ${
          program.init || "."
        }`,
        {
          async: true,
        }
      );
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

  spinner.stop();
  console.log("Finished");
  exit(0);
}

run();
