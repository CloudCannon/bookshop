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

    // console.log(files);
    // console.log(structureCount);
    // process.exit(1);
    eleventyConfig.addLiquidTag("bookshop_live", liveTagHandler);
};