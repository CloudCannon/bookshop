import ClientRouterInternal from './client-router.astro';

export const ClientRouter = ClientRouterInternal;

export const fade = (opts) => {
  console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  return {};
};

export const slide = (opts) => {
  console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  return {};
};

export const navigate = (href, options) => {
  console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
};

export const supportsViewTransitions = false;

export const transitionEnabledOnThisPage = false;

export const getFallback = () => {
  console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  return 'none';
};

export const swapFunctions = {
  deselectScripts: () => {
    console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  },
  swapRootAttributes: () => {
    console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  },
  swapHeadElements: () => {
    console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  },
  saveFocus: () => {
    console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
    return () => {};
  },
  swapBodyElement: () => {
    console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  }
};
