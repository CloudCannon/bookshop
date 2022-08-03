import ejs from 'ejs';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const jekyll = {
	render: ejs.compile(readFileSync(join(__dirname, "jekyll.ejs.t"), 'utf8')),
	extension: 'jekyll.html'
};

export const hugo = {
	render: ejs.compile(readFileSync(join(__dirname, "hugo.ejs.t"), 'utf8')),
	extension: 'hugo.html'
};

export const eleventy = {
	render: ejs.compile(readFileSync(join(__dirname, "eleventy.ejs.t"), 'utf8')),
	extension: 'eleventy.liquid'
};

export const svelte = {
	render: ejs.compile(readFileSync(join(__dirname, "svelte.ejs.t"), 'utf8')),
	extension: 'svelte'
};

export const jekyll_page = {
	render: ejs.compile(readFileSync(join(__dirname, "page-jekyll.ejs.t"), 'utf8')),
	extension: 'jekyll.html'
};

export const hugo_page = {
	render: ejs.compile(readFileSync(join(__dirname, "page-hugo.ejs.t"), 'utf8')),
	extension: 'hugo.html'
};

export const eleventy_page = {
	render: ejs.compile(readFileSync(join(__dirname, "page-eleventy.ejs.t"), 'utf8')),
	extension: 'eleventy.liquid'
};

export const svelte_page = {
	render: ejs.compile(readFileSync(join(__dirname, "page-svelte.ejs.t"), 'utf8')),
	extension: 'svelte'
};

export const scss = {
	render: ejs.compile(readFileSync(join(__dirname, "scss.ejs.t"), 'utf8')),
};

export const bookshop_toml = {
	render: ejs.compile(readFileSync(join(__dirname, "bookshop-toml.ejs.t"), 'utf8')),
	extension: 'bookshop.toml'
};

export const bookshop_yml = {
	render: ejs.compile(readFileSync(join(__dirname, "bookshop-yml.ejs.t"), 'utf8')),
	extension: 'bookshop.yml'
};

export const bookshop_js = {
	render: ejs.compile(readFileSync(join(__dirname, "bookshop-js.ejs.t"), 'utf8')),
	extension: 'bookshop.js'
};

export const bookshop_json = {
	render: ejs.compile(readFileSync(join(__dirname, "bookshop-json.ejs.t"), 'utf8')),
	extension: 'bookshop.json'
};

export const bookshop_config = {
	render: ejs.compile(readFileSync(join(__dirname, "bookshop-config.ejs.t"), 'utf8')),
};

export const hugo_config = {
	render: ejs.compile(readFileSync(join(__dirname, "hugo-config.ejs.t"), 'utf8')),
};

export const global_style = {
	render: ejs.compile(readFileSync(join(__dirname, "global-style.ejs.t"), 'utf8')),
};