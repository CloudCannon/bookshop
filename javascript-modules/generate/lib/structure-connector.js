import chalk from 'chalk';

export const hydrateStructures = (infoJson, allStructures, options) => {
    infoJson["_structures"] = infoJson["_structures"] || {};

    allStructures?.forEach(structure => {
        let obj = infoJson["_structures"];
        let { structures, ...fields } = structure;

        structures?.forEach(structure_key => {
            obj[structure_key] = obj[structure_key] || {};
            obj[structure_key]["id_key"] = "_bookshop_name"
            obj[structure_key]["values"] = obj[structure_key]["values"] || [];
            obj[structure_key]["values"].push(fields);
        });
    });

}