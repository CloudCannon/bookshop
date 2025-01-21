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
