const path = require("path");
const fastGlob = require('fast-glob');
const TOML = require('@ltd/j-toml');
const fs = require("fs");
const { TransformComponent, GetComponentKey, NiceLabel } = require("@bookshop/cloudcannon-structures");
const { RewriteTOML } = require("@bookshop/toml-narrator");

const liveTagHandler = (liquidEngine) => {
    return {
        parse: function (tagToken, remainingTokens) {
            this.host = tagToken.args.trim();
        },
        render: async function (ctx, hash) {
            // TODO: Wire up remoteGlobals to Eleventy site data
            return `
<script>
window.addEventListener('load', function() {
    if (window.inEditorMode) {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.src = \`/${this.host}\`;
    script.onload = function() {
        window.bookshopLive = new window.BookshopLive({
        remoteGlobals: []
        });
        window.CloudCannon = {
        trigger: function (eventName, frontMatter) {
            if (typeof frontMatter === 'string') frontMatter = JSON.parse(frontMatter);
            window.bookshopLive.update({page: frontMatter});
        }
        }
    }
    head.appendChild(script);
    }
});
</script>`;
        }
    };
}

const addComponentTo = (obj, component) => {
    const {array_structures, ...fields} = component;
    array_structures?.forEach(structure => {
        obj[structure] = obj[structure] || {};
        obj[structure]["values"] = obj[structure]["values"] || [];
        obj[structure]["values"].push(fields);
    });
}

const hydrateStructures = (eleventyConfig) => {
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

    files?.forEach(file => {
        let contents = fs.readFileSync(path.join(baseLocation, file.path), "utf8")
        contents = RewriteTOML(contents);
        file.contents = TOML.parse(contents, 1.0, '\n', false);
        file.components = TransformComponent(file.path, file.contents);
        structureCount += file.components.length;
    });

    eleventyConfig.addTransform("hydrateCloudCannonInfo", function(content, outputPath) {
        if( outputPath && outputPath.endsWith("_cloudcannon/info.json") ) {
            try {
                let info_json = JSON.parse(content);
                info_json["_array_structures"] = info_json["_array_structures"] || {};
                
                files?.forEach(file => {
                    file.components?.forEach(component => {
                        addComponentTo(info_json["_array_structures"], component);
                    });
                });

                return JSON.stringify(info_json, null, 2);
            } catch(e) {
                console.warn(`Bookshop error ${e}`);
                process.exit(1);
            }
        }
    
        return content;
    });

    console.log(`Bookshop:`,
                `${structureCount} structure${structureCount == 1 ? "" : "s"} built`);
}

module.exports = function (eleventyConfig) {
    hydrateStructures(eleventyConfig);
    eleventyConfig.addLiquidTag("bookshop_live", liveTagHandler);
};