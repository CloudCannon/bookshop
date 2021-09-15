const path = require("path");
const fastGlob = require('fast-glob');
const TOML = require('@ltd/j-toml');
const fs = require("fs");
const { TransformComponent, GetComponentKey, NiceLabel } = require("@bookshop/cloudcannon-structures");
const { RewriteTOML } = require("@bookshop/toml-narrator");

module.exports = function (eleventyConfig) {
    let structureCount = 0;

    const locations = eleventyConfig.bookshopOptions.locations || [];
    const baseLocation = eleventyConfig.bookshopOptions.baseLocation;

    let globResults = locations.map(dir => {
        const loc = path.join(dir, "components");
        return fastGlob.sync(`${loc}/**/*.bookshop.toml`, {
            cwd: baseLocation,
        });
    });
    const allFiles = [].concat.apply([], globResults).sort();
    const files = Array.from(new Set(allFiles)).map(file => {return {path: file}});

    files.forEach(file => {
        let contents = fs.readFileSync(path.join(baseLocation, file.path), "utf8")
        contents = RewriteTOML(contents);
        file.contents = TOML.parse(contents, 1.0, '\n', false);
        file.components = TransformComponent(file.path, file.contents);
    });

    console.log(files);
    console.log(structureCount);
    process.exit(1);
};