export const processFrontmatter = (frontmatter) => {
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
  process([], frontmatter);
};

export const getDataBinding = (props) => {
  if (!props) {
    return null;
  }
  if (props.__bookshop_path) {
    return props.__bookshop_path;
  }
  for (const key of Object.keys(props)) {
    if (typeof props[key] !== "object") {
      continue;
    }
    const childBinding = getDataBinding(props[key]);
    if (childBinding) {
      return childBinding.replace(/\.[^.]*$/, "");
    }
  }
  return null;
};
