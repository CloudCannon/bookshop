import { getCollectionItem } from '$lib/collections.js';

export async function GET({ params }) {
	const pageDetails = await getCollectionItem('pages', params.slug);

	return {
		body: { pageDetails }
	};
}
