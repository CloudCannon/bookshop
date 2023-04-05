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
  const child_paths = [];
  const get_child_paths = (obj) => {
    if (obj?.__bookshop_path) {
      child_paths.push(obj?.__bookshop_path);
    }
    if (Array.isArray(obj)) {
      return obj.forEach(get_child_paths);
    } else if (obj && typeof obj === "object") {
      Object.values(obj).forEach(get_child_paths);
    }
    return obj;
  };
  get_child_paths(props);

  let data_binding_path;
  if (child_paths.length > 0) {
    data_binding_path = child_paths[0];
    while (!child_paths.every((path) => path.startsWith(data_binding_path))) {
      data_binding_path = data_binding_path.replace(/\.?\w+$/, "");
    }
  }
  return data_binding_path;
};
