export const sequence = (...handlers) => {
  console.warn("[Bookshop] middleware is not supported in Bookshop. Please use an editing fallback instead.");
  return () => {};
};

export const defineMiddleware = (fn) => {
  console.warn("[Bookshop] middleware is not supported in Bookshop. Please use an editing fallback instead.");
  return () => {};
};

export const createContext = (context) => {
  console.warn("[Bookshop] middleware is not supported in Bookshop. Please use an editing fallback instead.");
  return {};
};

export const trySerializeLocals = (value) => {
  console.warn("[Bookshop] middleware is not supported in Bookshop. Please use an editing fallback instead.");
  return '';
};

// transitions.js
export const ClientRouter = () => {
  console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  return null;
};

export const fade = (opts) => {
  console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  return {};
};

export const slide = (opts) => {
  console.warn("[Bookshop] view transitions are not supported in Bookshop. Please use an editing fallback instead.");
  return {};
};
