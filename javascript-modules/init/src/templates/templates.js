const ejs = require('ejs');
const {readFileSync} = require('fs');
const {join} = require('path');

module.exports = {
	jekyll: {
		render: ejs.compile(readFileSync(join(__dirname, "jekyll.ejs.t"), 'utf8')),
		extension: 'jekyll.html'
	},
	eleventy: {
		render: ejs.compile(readFileSync(join(__dirname, "eleventy.ejs.t"), 'utf8')),
		extension: 'eleventy.liquid'
	},
	svelte: {
		render: ejs.compile(readFileSync(join(__dirname, "svelte.ejs.t"), 'utf8')),
		extension: 'svelte'
	},
	bookshop: {
		render: ejs.compile(readFileSync(join(__dirname, "bookshop.ejs.t"), 'utf8')),
	},
	scss: {
		render: ejs.compile(readFileSync(join(__dirname, "scss.ejs.t"), 'utf8')),
	},
}