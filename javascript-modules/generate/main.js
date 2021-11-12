#! /usr/bin/env node
import path from 'path';
import fs from 'fs';
import { Command } from "commander";
import fastGlob from 'fast-glob';
import TOML from '@ltd/j-toml';
import normalizePath from "normalize-path";
import Structures from "@bookshop/cloudcannon-structures";
import Narrator from "@bookshop/toml-narrator";

const cwd = process.cwd();
const program = new Command();

const plur = (num, str, pluralStr) => {
    const pluralized = num === 1 ? str : (pluralStr ?? `${str}s`);
    return `${num} ${pluralized}`;
}

const addComponentTo = (obj, component) => {
    const { structures, ...fields } = component;
    structures?.forEach(structure => {
        obj[structure] = obj[structure] || {};
        obj[structure]["id_key"] = "_bookshop_name"
        obj[structure]["values"] = obj[structure]["values"] || [];
        obj[structure]["values"].push(fields);
    });
}

async function run() {
    program.option("-d, --dot", "Look for Bookshops inside . directories");
    program.parse(process.argv);
    const options = program.opts();

    const bookshopConfigFiles = await fastGlob(`./**/bookshop.config.js`, {
        cwd,
        dot: !!options.dot
    });

    const tomlFiles = [];

    for (const bookshopConfig of bookshopConfigFiles) {
        const bookshopRoot = path.dirname(path.dirname(bookshopConfig));
        console.log(`📚 Reading Bookshop ./${bookshopRoot}`);
        const bookshopPath = normalizePath(`${bookshopRoot}/**/*.bookshop.toml`);
        tomlFiles.push(...await fastGlob(bookshopPath, {
            cwd
        }));
    }

    const files = Array.from(new Set(tomlFiles.sort())).map(file => { return { path: file } });
    let structureCount = 0;

    files?.forEach(file => {
        let contents = fs.readFileSync(file.path, "utf8");
        contents = Narrator.RewriteTOML(contents);
        file.contents = TOML.parse(contents, 1.0, '\n', false);
        file.components = Structures.TransformComponent(file.path, file.contents);
        structureCount += file.components.length;
    });

    const infoJsonFiles = await fastGlob(`./**/_cloudcannon/info.json`, {
        cwd,
        dot: !!options.dot
    });

    for (const infoJsonFile of infoJsonFiles) {
        const siteRoot = path.dirname(path.dirname(infoJsonFile));
        console.log(`📚 Modifying built site at ./${siteRoot}`);
        const contents = fs.readFileSync(infoJsonFile, "utf8");
        const info_json = JSON.parse(contents);
        info_json["_array_structures"] = info_json["_array_structures"] || {};

        files?.forEach(file => {
            file.components?.forEach(component => {
                addComponentTo(info_json["_array_structures"], component);
            });
        });

        fs.writeFileSync(infoJsonFile, JSON.stringify(info_json, null, 2));
    }

    console.log(`📚 Added ${plur(structureCount, "structure")} from ${plur(bookshopConfigFiles.length, "Bookshop")} to ${plur(infoJsonFiles.length, "site")}.`);
}

run();