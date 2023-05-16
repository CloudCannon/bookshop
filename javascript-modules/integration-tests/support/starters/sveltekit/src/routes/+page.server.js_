import Filer from '@cloudcannon/filer';

export async function load({ params }) {
	const filer = new Filer({
		path: 'content'
	});

	const url = params.slug || 'index';
	const filepath = `${url}.md`
	const res = await filer.getItem(filepath, { folder: 'pages' });
	return res
}