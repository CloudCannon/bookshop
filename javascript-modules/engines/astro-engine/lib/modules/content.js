export const getCollection = async (collectionKey, filter) => {
  if (!window.__bookshop_collections) {
    console.warn("[Bookshop] Failed to load site collections for live editing");
    return [];
  }

  if (!window.__bookshop_collections[collectionKey]) {
    console.warn("[Bookshop] Failed to load collection: ", collectionKey);
    return [];
  }

  if (filter) {
    return window.__bookshop_collections[collectionKey].filter(filter);
  }
  return window.__bookshop_collections[collectionKey];
};

export const getEntry = async (...args) => {
  if (args.length === 1) {
    const { collection: collectionKey, slug: entrySlug, id: entryId } = args[0];
    const collection = await getCollection(collectionKey);
    if (entryId) {
      return collection.find(({ id }) => id === entryId);
    } else if (entrySlug) {
      return collection.find(({ slug }) => slug === entrySlug);
    }
    return console.warn(
      "[Bookshop] Failed to load entries, invalid arguments: ",
      args
    );
  }

  const [collectionKey, entryKey] = args;
  const collection = await getCollection(collectionKey);

  return collection.find(({ id, slug }) => entryKey === (slug ?? id));
};

export const getEntries = (entries) => {
  return Promise.all(entries.map(getEntry));
};

export const getEntryBySlug = (collection, slug) => {
  return getEntry({ collection, slug });
};

export const render = async () => ({ Content: () => "Content is not available when live editing", headings: [], remarkPluginFrontmatter: {} });

export const defineCollection = () => console.warn("[Bookshop] defineCollection is not supported in Bookshop. Make sure you're not importing your config in a component file by mistake.");
export const reference = () => console.warn("[Bookshop] reference is not supported in Bookshop. Make sure you're not importing your config in a component file by mistake.");
