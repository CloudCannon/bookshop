export default (src, componentName) => {
  let code = src.replace("@astrojs/react", "@bookshop/react");
  let name = code.match(
    /__astro_tag_component__\((?<export>.*), "@bookshop\/react"\)/
  )?.groups.export;

  if (name) {
    code = `${code}\n${name}.__bookshop_name = "${componentName}";`;
  }
  return code;
};
