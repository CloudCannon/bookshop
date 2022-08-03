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

const getComponentLabel = (path) => {
  return path.split('/').map(s => s[0].toUpperCase() + s.substr(1)).join(' ');
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

const initComponent = async (options, bookshopConfigFiles) => {
  if (!bookshopConfigFiles) {
    bookshopConfigFiles = await fastGlob(`./**/bookshop.config.{js,cjs}`, {
      cwd,
      dot: !!options.dot
    });
  }

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

  let bookshopConfigFile = join(bookshop, 'bookshop/bookshop.config.js');
  if (!existsSync(join(cwd, bookshopConfigFile))) {
    bookshopConfigFile = join(bookshop, 'bookshop/bookshop.config.cjs');
  }
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
      message: 'What configuration format would you like to use for components?',
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
  const componentLabel = getComponentLabel(options.component);
  const componentFileName = getComponentFileName(options.component);

  for (const framework of frameworks) {
    const template = templates[framework];
    if (!template) {
      const allowed = ['hugo', 'eleventy', 'jekyll', 'svelte'];
      console.error(chalk.red(`Unrecognized framework ${chalk.cyan(framework)}, expected one of: ${chalk.cyan(allowed.join(', '))}`));
      process.exit(1);
    }
    renderFile(
      template,
      { componentName, componentLabel },
      join(componentDirPath, `${componentFileName}.${template.extension}`)
    );
  }

  if (frameworks[0] !== "svelte") {
    renderFile(
      templates["scss"],
      { componentName },
      join(componentDirPath, `${componentFileName}.scss`)
    );
  }

  const bookshopTemplate = templates[`bookshop_${targetFormat}`];
  renderFile(
    bookshopTemplate,
    { componentName, componentLabel },
    join(componentDirPath, `${componentFileName}.${bookshopTemplate.extension}`)
  );
}

const initBookshop = async (options) => {
  console.log(chalk.magenta(`Creating a Bookshop project at ${options.new}`));

  mkdirSync(options.new, { recursive: true });
  mkdirSync(join(options.new, 'bookshop'), { recursive: true });
  mkdirSync(join(options.new, 'components'), { recursive: true });
  mkdirSync(join(options.new, 'shared', options.framework[0]), { recursive: true });

  if (options.framework[0] !== "svelte") {
    mkdirSync(join(options.new, 'shared', 'styles'), { recursive: true });
  }

  renderFile(
    templates["bookshop_config"],
    { ssg: options.framework[0] },
    join(options.new, `bookshop`, `bookshop.config.cjs`)
  );

  const pageComponent = `${options.framework[0]}_page`;
  renderFile(
    templates[pageComponent],
    {},
    join(options.new, `shared`, options.framework[0], `page.${templates[pageComponent].extension}`)
  );

  if (options.framework[0] !== "svelte") {
    renderFile(
      templates["global_style"],
      {},
      join(options.new, `shared`, `styles`, `global.scss`)
    );
  }

  if (options.framework[0] === "hugo") {
    renderFile(
      templates["hugo_config"],
      {},
      join(options.new, `config.toml`)
    );
  }

  options.component = "sample";
  await initComponent(options);
}

async function run() {
  program.option("-n, --new <project name>", "Create a new Bookshop in the given directory");
  program.option("-c, --component <component>", "Create a new component with the given name");
  program.option("-f, --framework <frameworks...>", "Optional: Space separated list of frameworks to use. Will be auto-detected if not supplied");
  program.addOption(new Option('--format <filetype>', 'Convert Bookshop files to another format').choices(['yml', 'toml', 'json', 'js']));
  program.option("-d, --dot", "Look for Bookshops inside . directories");
  program.parse(process.argv);
  const options = program.opts() ?? {};

  if (options.component && options.new) {
    console.error(chalk.red("--component and --new cannot be passed together"));
    process.exit(1);
  }

  const bookshopConfigFiles = await fastGlob(`./**/bookshop.config.{js,cjs}`, {
    cwd,
    dot: !!options.dot
  });

  let action;
  if (options.component) action = 'component';
  if (options.new) action = 'new';

  if (!options.component && !options.new && bookshopConfigFiles?.length) {
    options.component = true;
    action = 'component';
  }

  if (!options.component && !options.new) {
    const resp = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What do you want to create?',
      choices: ['A new Bookshop project', 'A new component'],
    }]);
    switch (resp.action) {
      case "A new Bookshop project":
        action = 'new';
        break;
      case "A new component":
        action = 'component';
        break
      default:
        process.exit(1);
    }
  }

  if (action === 'component') {
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
      await initComponent(options, bookshopConfigFiles);
      console.log(chalk.bold.green(`\nAll done.`));
      return;
    }
  } else if (action === 'new') {
    if (!options.new) {
      console.log(chalk.magenta("What directory would you like to create your Bookshop in?"));
      console.log(chalk.magenta("This will be relative to to the directory you're running this command in"));
      const resp = await inquirer.prompt([{
        type: 'input',
        name: 'newdir',
        message: 'Directory name:',
        validate: c => {
          if (/[^a-z0-9-_\/]/.test(c)) {
            return `Directory name must only contain alphanumeric, hyphen, underscore, and forward-slash`;
          } else {
            return true;
          }
        }
      }]);
      options.new = resp.newdir;
    }

    if (!options.framework || !options.framework.length) {
      const resp = await inquirer.prompt([{
        type: 'list',
        name: 'ssg',
        message: 'What framework do you want to create a new Bookshop project for?',
        choices: ['Hugo', 'Eleventy', 'Jekyll', 'Svelte'],
        filter(val) { return val.toLowerCase(); },
      }]);
      options.framework = [resp.ssg];
    }

    if (options.framework.length > 1) {
      console.error(chalk.red("Only one framework can be supplied for creating a new Bookshop"));
      process.exit(1);
    }

    if (options.new && options.framework) {
      await initBookshop(options);
      console.log(chalk.bold.green(`\nAll done.`));
      return;
    }
  }
}

run();
