import fs from 'fs';
import path from 'path';
import url from 'url';

export const filterBookshops = (bookshopDirectories = []) => {
    if (!bookshopDirectories.length) {
        throw new Error('No bookshop directories supplied — nothing to build.');
    }
    const filteredDirectories = bookshopDirectories.filter(dir => { return fs.existsSync(dir) });
    if (!filteredDirectories.length) {
        console.error(`Could not find any of ${bookshopDirectories.join(", ")}`);
        throw new Error('Referenced bookshop directories were not found on disk — nothing to build.');
    }
    return filteredDirectories;
}

export const loadConfig = async (bookshopDirectory = "") => {
    let primaryConfig = path.join(bookshopDirectory, 'bookshop/bookshop.config.js');
    if (!fs.existsSync(primaryConfig)) {
        primaryConfig = path.join(bookshopDirectory, 'bookshop/bookshop.config.cjs');
    }
    if (!fs.existsSync(primaryConfig)) {
        throw new Error("Couldn't find a bookshop.config.* file.")
    }
    const config = await import(url.pathToFileURL(primaryConfig));
    const engineImports = Object.keys(config.default.engines).map((engineName) => {
        return import(`${engineName}/build`);
    });
    const engines = await Promise.all(engineImports);
    return { engines, ignoreFilePatterns: config.default?.ignoreFilePatterns };
}
