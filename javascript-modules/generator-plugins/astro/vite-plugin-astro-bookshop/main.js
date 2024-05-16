import { cwd, env } from "process";
import processPage from "./processors/astro-pages.js";
import processReactJSX from "./processors/react-jsx.js";
import processAstroComponent from "./processors/astro-component.js";
import processAstro from "./processors/astro.js";

const PAGE_REGEX = /.*src((\/|\\)|(\/|\\).*(\/|\\))(layouts|pages).*(\/|\\)(?<name>\w*)\.astro$/;
const COMPONENT_REGEX =
  /.*src((\/|\\)|(\/|\\).*(\/|\\))(components|shared(\/|\\)astro)(\/|\\)(?<component>.*)\.(astro|jsx|tsx)$/;

const process = (src, id, includeErrorBoundaries, removeClientDirectives) => {
  id = id.replace(cwd().replace(/\\/g, "/"), "");

  const pageMatch = id.match(PAGE_REGEX);
  const componentMatch = id.match(COMPONENT_REGEX);

  let componentName = componentMatch?.groups?.component;

  if (id.endsWith(".astro")) {
    try {
      src = processAstro(src, componentName, includeErrorBoundaries, removeClientDirectives);
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
        code: processReactJSX(src, componentName, includeErrorBoundaries),
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

export default (options) => {
  const includeErrorBoundaries = options?.__includeErrorBoundaries ?? false
  const removeClientDirectives = options?.__removeClientDirectives ?? false

  return {
    name: "vite-plugin-astro-bookshop",
    enforce: "pre",

    transform(src, id) {
      try {
        return process(src, id, includeErrorBoundaries, removeClientDirectives);
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
