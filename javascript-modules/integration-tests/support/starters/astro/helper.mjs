import { getCollection } from "astro:content";

export default async () => {
    const pages = await getCollection(
        "pages",
        ({ slug }) => !slug.split("/").pop()?.startsWith("_")
    );
    return pages.map((page) => {
        const slug = page.slug.replace(/index$/, "");
        if (slug.length === 0)
        return { params: { slug: undefined }, props: { page } };
        return { params: { slug }, props: { page } };
    });
}
