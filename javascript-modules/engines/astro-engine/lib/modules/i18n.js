export const getRelativeLocaleUrl = (locale, path, options) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return '';
};

export const getAbsoluteLocaleUrl = (locale, path, options) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return '';
};

export const getRelativeLocaleUrlList = (path, options) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return [];
};

export const getAbsoluteLocaleUrlList = (path, options) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return [];
};

export const getPathByLocale = (locale) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return '';
};

export const getLocaleByPath = (path) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return '';
};

export const redirectToDefaultLocale = (context, statusCode) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return Promise.resolve(new Response());
};

export const redirectToFallback = (context, response) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return Promise.resolve(new Response());
};

export const notFound = (context, response) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return Promise.resolve(new Response());
};

export const middleware = (options) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return () => {};
};

export const requestHasLocale = (context) => {
  console.warn("[Bookshop] i18n routing is not supported in Bookshop. Please use an editing fallback instead.");
  return false;
};
