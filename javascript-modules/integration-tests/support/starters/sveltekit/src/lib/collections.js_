import { promises as fsPromises } from 'fs';
const { readdir, readFile } = fsPromises;
import path from 'path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const md = new MarkdownIt({ html: true });
const collectionsDirectory = path.join(process.cwd(), 'content');

export async function getCollectionSlugs(collection) {
	const fileNames = await readdir(path.join(collectionsDirectory, collection));
	return fileNames.map((fileName) => ({
		params: {
			slug: path.basename(fileName, path.extname(fileName))
		}
	}));
}

export async function getCollection(collection, options = {}) {
	const fileNames = await readdir(path.join(collectionsDirectory, collection));

	const collectionItems = await Promise.all(await fileNames.reduce(async (memo, fileName) => {
		const slug = path.basename(fileName, path.extname(fileName));

		if (!slug.startsWith('_')) {
			const item = await getCollectionItem(collection, slug, options);
			return [...await memo, item];
		}

		return memo;
	}, []));

	if (options.sortKey) {
		return collectionItems.sort((a, b) => {
			if (a[options.sortKey] === b[options.sortKey]) {
				return 0;
			}

			return a[options.sortKey] > b[options.sortKey] ? -1 : 1;
		});
	}

	return collectionItems;
}

export async function getCollectionItem(collection, slug, options = {}) {
	const fullPath = path.join(collectionsDirectory, collection, `${slug}.md`);
	const fileContents = await readFile(fullPath, 'utf8');
	const parsed = matter(fileContents);
	const contentHtml = parsed.data.content_html || md.render(parsed.content || '');

	if (options.excerpt) {
		parsed.data.excerpt_html = parsed.data.excerpt_html
			|| md.renderInline(parsed.content.split('\n').slice(1, 2).join(' '));
	}

	return {
		...parsed.data,
		slug,
		content_html: contentHtml
	};
}
