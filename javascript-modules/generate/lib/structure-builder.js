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

const generateDeepStructures = ({ blueprint, currentBlueprintKey, inputs }) => {
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
                value: generateDeepStructures({ blueprint: blueprint[0], currentBlueprintKey, inputs }),
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
            blueprint[key] = generateDeepStructures({ blueprint: blueprint[key], currentBlueprintKey: key, inputs });
        }
    }

    return blueprint;
}

const interlinkDeepStructures = ({ currentComponentName, blueprint, currentBlueprintKey, inputs, componentStructureMap }) => {
    if (!blueprint) return blueprint;

    const initInputKey = (type) => {
        inputs[currentBlueprintKey] = inputs[currentBlueprintKey] || {};
        inputs[currentBlueprintKey].options = inputs[currentBlueprintKey].options || {};
        inputs[currentBlueprintKey].type = type;
    }

    // Object structure, referencing a set of structures by _structures key
    if (typeof blueprint === "string" && /^bookshop:structure:./.test(blueprint)) {
        const structureKey = blueprint.replace(/^bookshop:structure:/, '');
        initInputKey("object");
        inputs[currentBlueprintKey].options.structures = `_structures.${structureKey}`;
        return {};
    }

    // Object structure, referencing a single component directly
    if (typeof blueprint === "string" && /^bookshop:./.test(blueprint)) {
        const componentKey = blueprint.replace(/^bookshop:/, '');
        if (!componentStructureMap[componentKey]) {
            console.error(chalk.red(`Component ${chalk.cyan(currentComponentName)} referenced ${chalk.cyan(blueprint)}, but the component ${chalk.cyan(componentKey)} does not exist.`));
            process.exit(1);
        }
        initInputKey("object");
        inputs[currentBlueprintKey].options.structures = {
            values: [componentStructureMap[componentKey]]
        };
        return {};
    }

    if (Array.isArray(blueprint)) {
        // Array structure, referencing a set of structures by _structures key
        if (blueprint.some(s => typeof s === "string" && /^bookshop:structure:./.test(s))) {
            if (blueprint.length > 1) {
                console.error(chalk.red(`Couldn't parse ${chalk.cyan(`${currentBlueprintKey}: ${JSON.stringify(blueprint)}`)}.`));
                console.error(chalk.red(`Bookshop shorthand arrays can only contain a single element.`));
                process.exit(1);
            }

            const structureKey = blueprint[0].replace(/^bookshop:structure:/, '');
            initInputKey("array");
            inputs[currentBlueprintKey].options.structures = `_structures.${structureKey}`;
            return [];
        }

        // Array structure, referencing a single component directly
        if (blueprint.some(s => typeof s === "string" && /^bookshop:./.test(s))) {
            if (blueprint.length > 1) {
                console.error(chalk.red(`Couldn't parse ${chalk.cyan(`${currentBlueprintKey}: ${JSON.stringify(blueprint)}`)}.`));
                console.error(chalk.red(`Bookshop shorthand arrays can only contain a single element.`));
                console.error(chalk.magenta(`If you want to have multiple elements available under this key:`));
                console.error(chalk.magenta(` — Give each component another key in structures (like ${chalk.cyan(`subcomponents`)})`));
                console.error(chalk.magenta(` — Use the ${chalk.cyan(`["bookshop:structure:subcomponents"]`)} shorthand`));
                process.exit(1);
            }

            const componentKey = blueprint[0].replace(/^bookshop:/, '');
            if (!componentStructureMap[componentKey]) {
                console.error(chalk.red(`Component ${chalk.cyan(currentComponentName)} referenced ${chalk.cyan(blueprint)}, but the component ${chalk.cyan(componentKey)} does not exist.`));
                process.exit(1);
            }
            initInputKey("array");
            inputs[currentBlueprintKey].options.structures = {
                values: [componentStructureMap[componentKey]]
            };
            return [];
        }

        return blueprint.map((b, i) => interlinkDeepStructures({
            currentComponentName,
            blueprint,
            currentBlueprintKey: i,
            inputs,
            componentStructureMap
        }));
    }

    if (typeof blueprint === "object") {
        for (let key of Object.keys(blueprint)) {
            blueprint[key] = interlinkDeepStructures({
                currentComponentName,
                blueprint: blueprint[key],
                currentBlueprintKey: key,
                inputs,
                componentStructureMap
            });
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

    const componentStructureMap = {};
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
                ...(generateDeepStructures({
                    blueprint: contents.blueprint || {},
                    currentBlueprintKey: "blueprint",
                    inputs: cascadeFields._inputs
                })),
            },
            label: niceLabel(getComponentKey(componentFile)), // Used as a fallback when no label is supplied inside [spec]
            structures: [],
            ...(contents.spec || {}),
            ...(cascadeFields),
        }

        componentStructureMap[structure.value._bookshop_name] = structure;
        return structure;
    });

    for (const structure of structures) {
        structure.value = interlinkDeepStructures({
            currentComponentName: structure.value._bookshop_name,
            blueprint: structure.value,
            currentBlueprintKey: null,
            inputs: structure._inputs,
            componentStructureMap
        });
    }

    return { bookshopRoots, structures };
}
