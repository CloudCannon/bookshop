import { createRequire } from "module";
import fs from 'fs';
import path from 'path';
import fastGlob from 'fast-glob';
import chalk from 'chalk';
import pluralize from 'pluralize';
import normalizePath from "normalize-path";

import TOML from '@ltd/j-toml';
import YAML from 'yaml';

const require = createRequire(import.meta.url);
const cwd = process.cwd();

const loadTOML = (file) => {
    let contents = fs.readFileSync(file, "utf8");
    return TOML.parse(contents, 1.0, '\n', false);
}

const loadYAML = (file) => {
    let contents = fs.readFileSync(file, "utf8");
    return YAML.parse(contents);
}

const loadJSON = (file) => {
    return require(path.join(cwd, file));
}

const loadJS = (file) => {
    const js = require(path.join(cwd, file));
    return (typeof js === "function") ? js() : js;
}

const loadFile = (file) => {
    const filetype = path.basename(file).split('.').reverse()[0].toLowerCase();
    switch (filetype) {
        case "toml":
            return loadTOML(file);
        case "yaml":
        case "yml":
            return loadYAML(file);
        case "json":
            return loadJSON(file);
        case "js":
        case "cjs":
            return loadJS(file);
        default:
            console.error(chalk.bold.red(`\nUnknown filetype: ${file}`));
            console.error(chalk.bold.red(`\nExpected .(yml|yaml|toml|json|js|cjs)`));
            process.exit(1);
    }
}

const cascadeEntries = ([key,]) => {
    return /^_/.test(key);
}

const getComponentKey = (componentPath) => {
    let base = componentPath.replace(/^.*components\//, '').split(".")[0];
    let parts = base.split("/");
    const l = parts.length;
    if (l >= 2 && parts[l - 1] === parts[l - 2]) {
        parts.pop();
        base = parts.join("/");
    }
    return base;
}

const niceLabel = (key) => {
    return key
        .replace(/^[a-z]/ig, (c) => c.toUpperCase())
        .replace(/[-_]([a-z0-9])/ig, (_, c) => ' ' + c.toUpperCase())
        .replace(/\/([a-z0-9])/ig, (_, c) => ' / ' + c.toUpperCase());
}

const generateDeepStructures = (blueprint, currentBlueprintKey, inputs) => {
    if (blueprint && Array.isArray(blueprint)) {
        if (typeof blueprint[0] === "object" && !Array.isArray(blueprint[0])) {
            // This is an array of objects.
            // To provide a better editing experience, we turn this into structures.

            if (inputs[currentBlueprintKey]?.type) {
                // Bail out if they have specifically configured this key.
                return blueprint;
            }

            inputs[currentBlueprintKey] = inputs[currentBlueprintKey] || {};
            inputs[currentBlueprintKey].options = inputs[currentBlueprintKey].options || {};

            const structure = {
                label: niceLabel(pluralize.singular(currentBlueprintKey)),
                icon: "add_box",
                value: generateDeepStructures(blueprint[0], currentBlueprintKey, inputs),
            };

            inputs[currentBlueprintKey].type = "array";
            inputs[currentBlueprintKey].options.structures = {
                values: [structure]
            };
            return [];
        }
        return blueprint;
    }
    if (!blueprint || typeof blueprint !== "object") {
        return blueprint;
    }

    for (let [key, value] of Object.entries(blueprint)) {
        if (typeof value === "object") {
            blueprint[key] = generateDeepStructures(blueprint[key], key, inputs);
        }
    }

    return blueprint;
}

export const buildStructures = async (options = {}) => {
    const bookshopRoots = [];
    let componentFiles = [];

    const bookshopConfigFiles = await fastGlob(`./**/bookshop.config.js`, {
        cwd,
        dot: !!options.dot
    });

    for (const bookshopConfigFile of bookshopConfigFiles) {
        const bookshopRoot = path.dirname(path.dirname(bookshopConfigFile));
        console.log(chalk.magenta(`Loading Bookshop from ./${bookshopRoot}`));
        const bookshopFilePattern = normalizePath(`${bookshopRoot}/**/*.bookshop.*`);
        bookshopRoots.push(bookshopRoot);

        const prevLength = componentFiles.length;
        componentFiles.push(...await fastGlob(bookshopFilePattern, {
            cwd
        }));
        console.log(chalk.green(`Loaded ${componentFiles.length - prevLength} components`));
    }

    componentFiles = Array.from(new Set(componentFiles.sort()));

    const structures = componentFiles.map(componentFile => {
        let contents;
        try {
            contents = loadFile(componentFile);
            if (!contents || typeof contents !== "object") {
                console.error(chalk.bold.red(`\nEncountered an error loading: ${componentFile}`));
                process.exit(1);
            };
        } catch (e) {
            console.error(chalk.bold.red(`\nEncountered an error loading: ${componentFile}`));
            console.error(chalk.yellow(e.toString()));
            process.exit(1);
        }

        let is_outdated = contents.props || contents.component;
        if (is_outdated) {
            console.error(chalk.bold.red(`\n${componentFile} contains old (2.0) syntax, which cannot be read.`));
            console.error(chalk.bold.red(`\nRun ${chalk.cyan(`npx @bookshop/up@latest`)} to migrate all old files`));
            process.exit(1);
        }

        const cascadeFields = Object.fromEntries(Object.entries(contents).filter(cascadeEntries));
        cascadeFields._inputs = cascadeFields._inputs || {};

        const structure = {
            value: {
                _bookshop_name: getComponentKey(componentFile),
                ...(generateDeepStructures(contents.blueprint || {}, "blueprint", cascadeFields._inputs)),
            },
            label: niceLabel(getComponentKey(componentFile)), // Used as a fallback when no label is supplied inside [spec]
            structures: [],
            ...(contents.spec || {}),
            ...(cascadeFields),
        }

        return structure;
    });

    return { bookshopRoots, structures };
}
