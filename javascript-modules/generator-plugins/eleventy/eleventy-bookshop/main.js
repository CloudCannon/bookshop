const path = require("path");
const fs = require("fs/promises");

module.exports = function (eleventyConfig) {
    eleventyConfig.addLiquidTag("bookshop", function (liquidEngine) {
        return {
            parse: function (tagToken, remainingTokens) {
                let [, component, args] = tagToken.args.match(/^(?:"|')(\S+)(?:"|')\s(.*)$/);
                this.output = `{% include ../../components/components/${component} ${args} %}`;
            },
            render: function (scope, hash) {
                const tpl = liquidEngine.parse(this.output);
                const output = liquidEngine.render(tpl, scope);
                return output;
            }
        };
    });
};