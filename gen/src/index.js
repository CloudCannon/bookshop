#! /usr/bin/env node
const templates = require("./templates/templates");
const { readdirSync, existsSync, mkdirSync, writeFileSync } = require("fs");
const { join, resolve } = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const argv = yargs(hideBin(process.argv))
  .option("name", {
    demandOption: true,
    type: "string",
    describe: "The name of the component to create",
  })
  .option("framework", {
    type: "string",
    describe: "Comma separated list of frameworks to use",
  }).argv;

const gen = async () => {
  const componentName = argv.name;
  const frameworks = {};
  const directories = [];

  if (argv.framework) {
    argv.framework.split(",").forEach((framework) => {
      frameworks[framework] = true;
    });
  }

  readdirSync(".", { withFileTypes: true }).forEach((entry) => {
    if (!entry.isDirectory()) {
      return;
    }
    const bookshopConfigPath = join(entry.name, "bookshop.config.js");

    //Check if the command has been run in the component library folder
    if (entry.name === "bookshop" && existsSync(bookshopConfigPath)) {
      directories.push(".");
      try {
        const bookshopConfig = require(resolve(bookshopConfigPath));
        Object.keys(bookshopConfig.engines).forEach((engine) => {
          const frameworkMatch = engine.match(
            /^(@[^/]*\/)?(?<framework>[^/]*)-engine$/
          );
          if (frameworkMatch?.groups["framework"]) {
            frameworks[frameworkMatch.groups["framework"]] = true;
          }
        });
      } catch (err) {
        console.error(
          `Failed to read bookshop config file: ${bookshopConfigPath}`
        );
      }
    }

    //Check if the command is run in the root directory
    readdirSync(entry.name).forEach((subentry) => {
      const bookshopConfigPath = join(
        entry.name,
        subentry,
        "bookshop.config.js"
      );
      if (subentry === "bookshop" && existsSync(bookshopConfigPath)) {
        directories.push(join(".", entry.name));
        try {
          const bookshopConfig = require(resolve(bookshopConfigPath));
          Object.keys(bookshopConfig.engines).forEach((engine) => {
            const frameworkMatch = engine.match(
              /^(@[^/]*\/)?(?<framework>[^/]*)-engine$/
            );
            if (frameworkMatch?.groups["framework"]) {
              frameworks[frameworkMatch.groups["framework"]] = true;
            }
          });
        } catch (err) {
          console.error(
            `Failed to read bookshop config file: ${bookshopConfigPath}`
          );
        }
      }
    });
  });

  if (directories.length === 0) {
    console.error("Failed to find any bookshop component libraries.");
    return;
  }

  if (Object.keys(frameworks).length === 0) {
    console.error("Failed to detect frameworks and none were provided");
    return;
  }

  directories.forEach((directory) => {
    const componentDirPath = join(directory, "components", componentName);
    mkdirSync(componentDirPath, { recursive: true });

    if (!existsSync(join(componentDirPath, `${componentName}.bookshop.toml`))) {
      writeFileSync(
        join(componentDirPath, `${componentName}.bookshop.toml`),
        templates["bookshop"].render({ componentName })
      );
    }
    if (!existsSync(join(componentDirPath, `${componentName}.scss`))) {
      writeFileSync(
        join(componentDirPath, `${componentName}.scss`),
        templates["scss"].render({ componentName })
      );
    }

    Object.keys(frameworks).forEach((framework) => {
      const template = templates[framework];
      if (!template) {
        console.error(`Unrecognized framework ${framework}`);
        delete frameworks[framework];
        return;
      }
      const componentPath = join(
        componentDirPath,
        `${componentName}.${template.extension}`
      );
      if (!existsSync(componentPath)) {
        writeFileSync(componentPath, template.render({ componentName }));
      }
    });
  });
};

gen();
