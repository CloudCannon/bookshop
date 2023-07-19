import { createRequire } from "module";
import fs from 'fs';
import path from 'path';
import fastGlob from 'fast-glob';
import chalk from 'chalk';
import pluralize from 'pluralize';
import normalizePath from "normalize-path";
import slugify from "slugify";

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

const getComponentBase = (componentPath) => {
    return componentPath.replace(/^.*?components\//, '').split(".")[0];
}

const getComponentKey = (componentPath) => {
    let base = getComponentBase(componentPath);
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

const componentSlug = (componentKey) => {
    return componentKey.split('/').map(k => slugify(k.replace(/-/g, '_'), {
        replacement: '_',
        remove: /[^a-z0-9_]/,
        lower: true,
        strict: true,
    })).join('_');
}

const generateDeepStructures = ({ blueprint, currentBlueprintKey, inputs, cascadeFields }) => {
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

            const deepInputs = {};
            const structure = {
                label: niceLabel(pluralize.singular(currentBlueprintKey)),
                icon: "add_box",
                value: generateDeepStructures({ blueprint: blueprint[0], currentBlueprintKey, inputs: deepInputs, cascadeFields }),
                ...cascadeFields,
            };
            structure._inputs = structure._inputs || {};
            structure._inputs = {
                ...structure._inputs,
                ...deepInputs
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
            blueprint[key] = generateDeepStructures({ blueprint: blueprint[key], currentBlueprintKey: key, inputs, cascadeFields });
        }
    }

    return blueprint;
}

// For this structure, and all of its inputs that have structures, run interlinkStructureValue
const interlinkStructure = ({ structure, componentStructureMap }) => {
    structure._inputs = structure._inputs || {};

    structure.value = interlinkStructureValue({
        currentComponentName: structure.value._bookshop_name,
        blueprint: structure.value,
        currentBlueprintKey: null,
        inputs: structure._inputs,
        componentStructureMap
    });

    for (const input of Object.values(structure._inputs)) {
        for (const substructure of (input?.options?.structures?.values || [])) {
            interlinkStructure({
                structure: substructure,
                componentStructureMap,
            });
        }
    }
}

// Find any Bookshop shorthand for nesting components, and create the necessary input configurations.
const interlinkStructureValue = ({ currentComponentName, blueprint, currentBlueprintKey, inputs, componentStructureMap }) => {
    if (!blueprint) return blueprint;

    const initInputKey = (type) => {
        inputs[currentBlueprintKey] = inputs[currentBlueprintKey] || {};
        inputs[currentBlueprintKey].options = inputs[currentBlueprintKey].options || {};
        inputs[currentBlueprintKey].type = type;
    }

    let shorthand = parseShorthand(blueprint, currentComponentName);
    if (shorthand) {
        if (shorthand.structure) {
            initInputKey("object");
            inputs[currentBlueprintKey].options.structures = `_structures.${shorthand.key}`;
            if (shorthand.initialize || shorthand.param) {
                return {
                    __BOOKSHOP_GEN_STRUCTURE__: shorthand
                }
            } else {
                return null;
            }
        } else if (shorthand.key) {
            if (!componentStructureMap[shorthand.key]) {
                console.error(chalk.red(`Component ${chalk.cyan(currentComponentName)} referenced ${chalk.cyan(blueprint)}, but the component ${chalk.cyan(shorthand.key)} does not exist.`));
                process.exit(1);
            }
            initInputKey("object");
            const key = `_bookshop_single_component_${componentSlug(shorthand.key)}`;
            inputs[currentBlueprintKey].options.structures = `_structures.${key}`;
            // Flag that the structure we just referenced will need to be created globally from the referenced component
            componentStructureMap[shorthand.key].outputComponentStructure = true;
            if (shorthand.initialize) {
                return {
                    __BOOKSHOP_GEN_STRUCTURE__: { ...shorthand, key }
                }
            } else {
                return null;
            }
        }
    }

    if (Array.isArray(blueprint) && blueprint.length) {
        let shorthand_arr = blueprint.map(b => parseShorthand(b, currentComponentName));
        if (shorthand_arr.some(s => s)) {
            shorthand = shorthand_arr.find(s => s);
            if (!shorthand_arr.every(s => (s && s.structure === shorthand.structure && s.key === shorthand.key))) {
                console.error(chalk.red(`Component ${chalk.cyan(currentComponentName)} contains an array that starts with ${chalk.cyan(blueprint[0])}, but the following items do not match`));
                if (shorthand.structure) {
                    console.error(chalk.red(`Any subsequent array entries must be of the form bookshop:structure:${shorthand.key}!(<component_name>)`));
                } else {
                    console.error(chalk.red(`Any subsequent array entries must be of the form bookshop:${shorthand.key}!`));
                    console.error(chalk.red(`To allow multiple components, assign each one to a common structure`));
                    console.error(chalk.red(`e.g. add components to 'subcomponents' and reference bookshop:structure:subcomponents`));
                }
                process.exit(1);
            }
            const output = shorthand_arr.map(shorthand => {
                let key = shorthand.key;
                if (shorthand.structure) {
                    initInputKey("array");
                    inputs[currentBlueprintKey].options.structures = `_structures.${shorthand.key}`;
                } else {
                    if (!componentStructureMap[shorthand.key]) {
                        console.error(chalk.red(`Component ${chalk.cyan(currentComponentName)} referenced ${chalk.cyan(blueprint)}, but the component ${chalk.cyan(shorthand.key)} does not exist.`));
                        process.exit(1);
                    }
                    initInputKey("array");
                    key = `_bookshop_single_component_${componentSlug(shorthand.key)}`;
                    inputs[currentBlueprintKey].options.structures = `_structures.${key}`;
                    // Flag that the structure we just referenced will need to be created globally from the referenced component
                    componentStructureMap[shorthand.key].outputComponentStructure = true;
                }

                if (!(shorthand.initialize || (shorthand.structure && shorthand.param))) return null;
                return {
                    __BOOKSHOP_GEN_STRUCTURE__: { ...shorthand, key }
                }
            }).filter(s => s);
            return output;
        }

        // Handle arrays of objects by recursion — no scoping on these so it takes the same inputs config 
        return blueprint.map((b, i) => interlinkStructureValue({
            currentComponentName,
            blueprint: b,
            currentBlueprintKey: i,
            inputs,
            componentStructureMap
        }));
    }

    // Handle nested of objects by recursion — no scoping on these so it takes the same inputs config 
    if (typeof blueprint === "object") {
        for (let key of Object.keys(blueprint)) {
            blueprint[key] = interlinkStructureValue({
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

const parseShorthand = (input, context) => {
    if (typeof input !== "string") return null;

    const shorthand_regex = /^bookshop:(?<structure>structure:)?(?<key>.+?)(?<initialize>!)?(?:\((?<param>.+?)\))?$/;
    const shorthand = input.match(shorthand_regex)?.groups;
    if (!shorthand) return null;
    shorthand.input = input;
    shorthand.raw_key = shorthand.key;

    if (shorthand.param && !shorthand.structure) {
        console.error(chalk.red(`Component ${chalk.cyan(context)} referenced ${chalk.cyan(input)}.`));
        console.error(chalk.red(`Single component shorthands cannot have parameters, did you mean to use the bookshop:structure: shorthand?`));
        process.exit(1);
    }
    if (shorthand.structure && shorthand.initialize && !shorthand.param) {
        console.error(chalk.red(`Component ${chalk.cyan(context)} referenced ${chalk.cyan(input)} but did not provide a component name as a parameter`));
        console.error(chalk.red(`Expected ${chalk.cyan(`bookshop:structure:${shorthand.key}`)} or ${chalk.cyan(`bookshop:structure:${shorthand.key}!(<component_name>)`)}`));
        process.exit(1);
    }

    return shorthand;
}

export const buildStructures = async (options = {}) => {
    const bookshopRoots = [];
    let componentFiles = [];
    let relocations = [];

    const bookshopConfigFiles = await fastGlob(`./**/bookshop.config.{js,cjs}`, {
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

    console.log(chalk.magenta(`Creating structures for all components...`));
    const componentStructureMap = {};
    const structures = await Promise.all(componentFiles.map(componentFile => (async function (componentFile) {
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
        const cascadeFieldsCopy = JSON.parse(JSON.stringify(cascadeFields));

        const structure = {
            value: {
                _bookshop_name: getComponentKey(componentFile),
                ...(generateDeepStructures({
                    blueprint: contents.blueprint || {},
                    currentBlueprintKey: "blueprint",
                    inputs: cascadeFields._inputs,
                    cascadeFields: cascadeFieldsCopy
                })),
            },
            label: niceLabel(getComponentKey(componentFile)), // Used as a fallback when no label is supplied inside [spec]
            structures: [],
            ...(contents.spec || {}),
            ...(cascadeFields),
        }

        const componentImages = await fastGlob(componentFile.replace(/bookshop\.\w+$/, "@(preview|icon).*"), {
            cwd
        });
        for (const image of componentImages) {
            const outputImage = image.replace(/^.*components\//, '/_cloudcannon/bookshop_thumbs/');
            if (/preview\..+$/.test(image)) {
                structure.preview_image = outputImage;
            } else if (/icon\..+$/.test(image)) {
                structure.image = outputImage;
            }
            relocations.push({ from: image, to: outputImage });
        }

        componentStructureMap[structure.value._bookshop_name] = structure;
        return structure;
    })(componentFile)));

    console.log(chalk.magenta(`Hydrating structures for nested components...`));
    for (const structure of structures) {
        interlinkStructure({ structure, componentStructureMap });
    }

    // To reduce info.json noise, we only output single structures for components that were referenced in shorthand.
    for (const [componentKey, component] of Object.entries(componentStructureMap)) {
        if (component["outputComponentStructure"]) {
            delete component["outputComponentStructure"];
            structures.push({
                ...component,
                structures: [`_bookshop_single_component_${componentSlug(componentKey)}`]
            });
        }
    }

    return { bookshopRoots, structures, relocations };
}
