const pluginBookshop = require("@bookshop/eleventy-bookshop");
const pluginCloudCannon = require('eleventy-plugin-cloudcannon');
const MarkdownIt = require("markdown-it"),
	md = new MarkdownIt({
		html: true,
	});

module.exports = function (eleventyConfig) {
	eleventyConfig.setUseGitIgnore(false);
	eleventyConfig.setDataDeepMerge(true);
	eleventyConfig.addFilter("markdownify", (markdown) => md.render(markdown));

	eleventyConfig.addPlugin(pluginBookshop({
		bookshopLocations: ["../component-lib"]
	}));

	eleventyConfig.cloudcannonOptions = {
		dir: {
			pages: 'pages'
		}
	};

	eleventyConfig.addPlugin(pluginCloudCannon);
};
