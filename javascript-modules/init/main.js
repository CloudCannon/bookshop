#! /usr/bin/env node
import { createRequire } from "module";
import { readdirSync, existsSync, mkdirSync, writeFileSync } from "fs";
import { join, resolve, dirname } from "path";
import { Command, Option } from "commander";
import inquirer from "inquirer";
import chalk from 'chalk';
import fastGlob from 'fast-glob';

import * as templates from "./lib/templates/templates.js";

const require = createRequire(import.meta.url);
const cwd = process.cwd();
const program = new Command();

const getComponentName = (path) => {
  return path.replace(/\//g, "-");
}

const getComponentFileName = (path) => {
  return path.split("/").reverse()[0];
}

const comments = {
  specComment: "Metadata about this component, to be used in the CMS",
  blueprintComment: "Defines the structure of this component, as well as the default values",
  previewComment: "Overrides any fields in the blueprint when viewing this component in the component browser",
  inputsComment: "Any extra CloudCannon inputs configuration to apply to the blueprint",
};

const renderFile = (template, props, filename) => {
  if (!existsSync(filename)) {
    writeFileSync(
      filename,
      template.render({
        ...comments,
        ...props
      })
    );
    console.log(chalk.green(`Wrote ${filename}`));
  } else {
    console.log(chalk.gray(`Skipping ${filename} (already exists)`));
  }
}

const initComponent = async (options) => {
  const bookshopConfigFiles = await fastGlob(`./**/bookshop.config.js`, {
    cwd,
    dot: !!options.dot
  });

  if (!bookshopConfigFiles.length) {
    console.error(chalk.red(`Couldn't locate a ${chalk.cyan(`bookshop.config.js`)} file to anchor the component with`));
    console.error(chalk.red(`Make sure you're running this command in the parent directory of a Bookshop project`));
    process.exit(1);
  }

  const bookshops = bookshopConfigFiles.map(b => dirname(dirname(b))).sort();
  let bookshop = bookshops[0];

  if (bookshops.length > 1) {
    console.log(chalk.magenta(`Located more than one Bookshop project, where would you like to make this component?`));
    const resp = await inquirer.prompt([{
      type: 'list',
      name: 'location',
      message: 'Which location',
      choices: bookshops,
    }]);
    bookshop = resp.location;
  }

  const bookshopConfigFile = join(bookshop, 'bookshop/bookshop.config.js');
  let bookshopConfig;
  try {
    bookshopConfig = require(join(cwd, bookshopConfigFile));
  } catch (e) {
    console.error(chalk.red(`Failed to load ${chalk.cyan(bookshopConfigFile)}`));
    console.error(e.toString());
    process.exit(1);
  }

  let frameworks = options.framework || [];
  if (!frameworks.length) {
    for (const engine of (Object.keys(bookshopConfig.engines || {}))) {
      const frameworkMatch = engine.match(
        /^(@[^/]*\/)?(?<framework>[^/]*)-engine$/
      );
      if (frameworkMatch?.groups["framework"]) {
        frameworks.push(frameworkMatch.groups["framework"]);
      }
    }
  }

  if (!frameworks.length) {
    console.error(chalk.red(`Couldn't detect any frameworks in ${chalk.cyan(bookshopConfigFile)}`));
    console.error(chalk.yellow(`Do you have any engines listed in your config file?`));
    console.error(chalk.yellow(`Use the ${chalk.cyan(`--framework`)} flag to specify this manually`));
    process.exit(1);
  }

  let targetFormat = options.format;
  if (!targetFormat) {
    const resp = await inquirer.prompt([{
      type: 'list',
      name: 'format',
      message: 'What configuration format would you like to use?',
      choices: ['YAML (Recommended)', 'TOML', 'JS', 'JSON'],
      filter(val) {
        return val.split(' ')[0].toLowerCase().replace(/yaml/, 'yml');
      },
    }]);
    targetFormat = resp.format;
  }
  console.log('');

  const componentDirPath = join(bookshop, "components", options.component);
  mkdirSync(componentDirPath, { recursive: true });

  const componentName = getComponentName(options.component);
  const componentFileName = getComponentFileName(options.component);

  for (const framework of frameworks) {
    const template = templates[framework];
    if (!template) {
      const allowed = Object.keys(templates).filter(f => !/scss|bookshop/.test(f));
      console.error(chalk.red(`Unrecognized framework ${chalk.cyan(framework)}, expected one of: ${chalk.cyan(allowed.join(', '))}`));
      process.exit(1);
    }
    renderFile(
      template,
      { componentName },
      join(componentDirPath, `${componentFileName}.${template.extension}`)
    );
  }

  renderFile(
    templates["scss"],
    { componentName },
    join(componentDirPath, `${componentFileName}.scss`)
  );

  const bookshopTemplate = templates[`bookshop_${targetFormat}`];
  renderFile(
    bookshopTemplate,
    { componentName },
    join(componentDirPath, `${componentFileName}.${bookshopTemplate.extension}`)
  );
}

async function run() {
  program.option("-c, --component <component>", "The name of a component to create");
  program.option("-f, --framework <frameworks...>", "Optional: Space separated list of frameworks to use. Will be aut-detected if not supplied");
  program.addOption(new Option('--format <filetype>', 'Convert Bookshop files to another format').choices(['yml', 'toml', 'json', 'js']));
  program.option("-d, --dot", "Look for Bookshops inside . directories");
  program.parse(process.argv);
  const options = program.opts();

  if (!options.component) {
    console.log(chalk.magenta("What is the name of your new component?"));
    console.log(chalk.magenta(`You can use a path here, i.e. ${chalk.cyan(`blocks/hero/large`)}`));
    const resp = await inquirer.prompt([{
      type: 'input',
      name: 'component',
      message: 'Component name:',
      validate: c => {
        if (/[^a-z0-9-_\/]/.test(c)) {
          return `Component name must only contain alphanumeric, hyphen, underscore, and forward-slash`;
        } else {
          return true;
        }
      }
    }]);
    options.component = resp.component;
  }

  if (options.component) {
    await initComponent(options);
    console.log(chalk.bold.green(`\nAll done.`));
    return;
  }
}

run();
