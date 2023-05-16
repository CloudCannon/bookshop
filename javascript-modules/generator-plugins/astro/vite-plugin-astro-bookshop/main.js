import { cwd } from "process";
import processPage from "./processors/astro-pages.js";
import processReactJSX from "./processors/react-jsx.js";
import processAstroComponent from "./processors/astro-component.js";
import processAstro from "./processors/astro.js";

const PAGE_REGEX = /.*src(\/|\\)(layouts|pages).*(\/|\\)(?<name>\w*)\.astro$/;
const COMPONENT_REGEX =
  /.*src(\/|\\)(components|shared(\/|\\)astro)(\/|\\)(?<component>.*)\.(astro|jsx|tsx)$/;

export default () => {
  return {
    name: "vite-plugin-astro-bookshop",
    enforce: "pre",

    transform(src, id) {
      id = id.replace(cwd().replace(/\\/g, '/'), "");

      const pageMatch = id.match(PAGE_REGEX);
      const componentMatch = id.match(COMPONENT_REGEX);

      if(id.endsWith('.astro')){
        src = processAstro(src);
      }

      if (pageMatch) {
        return { code: processPage(src) };
      }

      if (!componentMatch) {
        return { code: src };
      }

      let { component: componentName } = componentMatch.groups;
      let parts = componentName.replace(/\\/g, '/').split("/");
      if (
        parts.length >= 2 &&
        parts[parts.length - 1] === parts[parts.length - 2]
      ) {
        parts.pop();
      }
      componentName = parts.join("/");

      if (id.endsWith(".jsx") || id.endsWith(".tsx")) {
        return {
          code: processReactJSX(src, componentName),
        };
      }

      return { code: processAstroComponent(src, componentName) };
    },
  };
};
