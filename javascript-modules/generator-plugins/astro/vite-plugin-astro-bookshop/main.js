import { cwd } from "process";
import processLayout from "./processors/astro-layouts.js";
import processReactJSX from "./processors/react-jsx.js";
import processAstroComponent from "./processors/astro-component.js";
import processAstro from "./processors/astro.js";

const LAYOUT_REGEX = /.*src\/layouts.*\/(?<layout>\w*)\.astro$/;
const COMPONENT_REGEX =
  /^\/src\/(components|shared\/astro)\/(?<component>.*)\.(astro|jsx|tsx)$/;

export default () => {
  return {
    name: "vite-plugin-astro-bookshop",
    enforce: "pre",

    transform(src, id) {
      id = id.replace(cwd(), "");

      const layoutMatch = id.match(LAYOUT_REGEX);
      const componentMatch = id.match(COMPONENT_REGEX);

      if(id.endsWith('.astro')){
        src = processAstro(src);
      }

      if (layoutMatch) {
        return { code: processLayout(src) };
      }

      if (!componentMatch) {
        return { code: src };
      }

      let { component: componentName } = componentMatch.groups;
      let parts = componentName.split("/");
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
