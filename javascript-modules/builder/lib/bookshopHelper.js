import fs from 'fs';
import path from 'path';
import url from 'url';

export const filterBookshops = (bookshopDirectories = []) => {
    if (!bookshopDirectories.length) {
        throw new Error('No bookshop directories supplied — nothing to build.');
    }
    const filteredDirectories = bookshopDirectories.filter(dir => {return fs.existsSync(dir)});
    if (!filteredDirectories.length) {
        console.error(`Could not find any of ${bookshopDirectories.join(", ")}`);
        throw new Error('Referenced bookshop directories were not found on disk — nothing to build.');
    }
    return filteredDirectories;
}

export const loadConfig = async (bookshopDirectory = "") => {
    const primaryConfig = path.join(bookshopDirectory, 'bookshop/bookshop.config.js');
    const config = await import(url.pathToFileURL(primaryConfig));
    const engineImports = Object.keys(config.default.engines).map((engineName) => {
        return import(`${engineName}/build`);
    });
    const engines = await Promise.all(engineImports);
    return {engines};
}