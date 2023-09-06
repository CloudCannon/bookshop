import { cwd, env } from "process";
import processPage from "./processors/astro-pages.js";
import processReactJSX from "./processors/react-jsx.js";
import processAstroComponent from "./processors/astro-component.js";
import processAstro from "./processors/astro.js";

const PAGE_REGEX = /.*src(\/|\\)(layouts|pages).*(\/|\\)(?<name>\w*)\.astro$/;
const COMPONENT_REGEX =
  /.*src(\/|\\)(components|shared(\/|\\)astro)(\/|\\)(?<component>.*)\.(astro|jsx|tsx)$/;

const process = (src, id) => {
  id = id.replace(cwd().replace(/\\/g, "/"), "");

  const pageMatch = id.match(PAGE_REGEX);
  const componentMatch = id.match(COMPONENT_REGEX);

  if (id.endsWith(".astro")) {
    try {
      src = processAstro(src);
    } catch (err) {
      err.processor = "astro";
      throw err;
    }
  }

  if (pageMatch) {
    try {
      return { code: processPage(src) };
    } catch (err) {
      err.processor = "astro-page";
      throw err;
    }
  }

  if (!componentMatch) {
    return { code: src };
  }

  let { component: componentName } = componentMatch.groups;
  let parts = componentName.replace(/\\/g, "/").split("/");
  if (
    parts.length >= 2 &&
    parts[parts.length - 1] === parts[parts.length - 2]
  ) {
    parts.pop();
  }
  componentName = parts.join("/");

  if (id.endsWith(".jsx") || id.endsWith(".tsx")) {
    try {
      return {
        code: processReactJSX(src, componentName),
      };
    } catch (err) {
      err.processor = "react-jsx";
      throw err;
    }
  }

  try {
    return { code: processAstroComponent(src, componentName) };
  } catch (err) {
    err.processor = "astro-component";
    throw err;
  }
};

export default () => {
  return {
    name: "vite-plugin-astro-bookshop",
    enforce: "pre",

    transform(src, id) {
      try {
        return process(src, id);
      } catch (err) {
        let prefix = "[vite-plugin-astro-bookshop]";
        if (err.processor) {
          prefix = prefix.concat(`[${err.processor}]`);
        }
        console.warn(`${prefix} Failed to process ${id}: ${err}`);
        if (env.BOOKSHOP_VERBOSE && err.stack) {
          console.warn(err.stack);
        }
      }
    },
  };
};
