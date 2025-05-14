import chalk from 'chalk';

const hydrateNestedComponents = (obj, structures, limitRecursion) => {
    if (!obj || typeof obj !== "object") return obj;

    if (obj.__BOOKSHOP_GEN_STRUCTURE__) {
        if (limitRecursion) {
            return null;
        }
        const shorthand = obj.__BOOKSHOP_GEN_STRUCTURE__;
        const structure = structures[shorthand.key];
        let structureValue = structure.values?.[0]?.value;
        if (!structureValue) {
            if (shorthand.structure) {
                console.error(chalk.red(`A blueprint referenced ${shorthand.input}, but the ${shorthand.key} structure does not exist`));
                process.exit(1);
            } else {
                console.error(chalk.red(`A blueprint referenced ${shorthand.input}, but the ${shorthand.key} component does not exist`));
                process.exit(1);
            }
        }
        if (shorthand.param) {
            structureValue = structure.values.find(v => v?.value?._bookshop_name === shorthand.param)?.value;
            if (!structureValue) {
                console.error(chalk.red(`A blueprint referenced ${shorthand.input}, but the component ${shorthand.param} does not exist in the ${shorthand.key} structure`));
                process.exit(1);
            }
        }
        return JSON.parse(JSON.stringify(structureValue));
    }
    for (const key of Object.keys(obj)) {
        obj[key] = hydrateNestedComponents(obj[key], structures, limitRecursion);
    }
    return obj;
}

export const hydrateStructures = (infoJson, allStructures, options) => {
    infoJson["_structures"] = infoJson["_structures"] || {};

    allStructures?.forEach(structure => {
        let obj = infoJson["_structures"];
        let { structures, ...fields } = structure;

        structures?.sort()?.forEach(structure_key => {
            obj[structure_key] = obj[structure_key] || {};
            obj[structure_key]["id_key"] = "_bookshop_name"
            obj[structure_key]["values"] = obj[structure_key]["values"] || [];
            obj[structure_key]["values"].push(fields);
        });
    });

    const baseStructureReference = JSON.parse(JSON.stringify(infoJson["_structures"]));
    for (let i = 0; i < 6; i++) {
        hydrateNestedComponents(infoJson["_structures"], baseStructureReference, false);
    }
    // Cap off any deep recursion with empty objects
    hydrateNestedComponents(infoJson["_structures"], baseStructureReference, true);
}
