const process = (path, obj) => {
  if (Array.isArray(obj)) {
    Object.defineProperty(obj, "__bookshop_path", {
      enumerable: false,
      writable: true,
      value: path.join("."),
    });
    obj.map((v, i) => process([...path, `${i}`], v));
  } else if (obj && typeof obj === "object") {
    Object.defineProperty(obj, "__bookshop_path", {
      enumerable: false,
      writable: true,
      value: path.join("."),
    });
    Object.entries(obj).forEach(([k, v]) => {
      process([...path, k], v);
    });
  }
};

export const processFrontmatter = (frontmatter) => {
  process([], frontmatter);
};