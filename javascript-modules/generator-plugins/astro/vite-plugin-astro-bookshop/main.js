import { cwd } from "process";
import processLayout from "./processors/layouts.js";
import processReactJSX from "./processors/react-jsx.js";
import processAstro from "./processors/astro.js";

const LAYOUT_REGEX = /.*src\/layouts.*\/(?<layout>\w*)\.astro$/;
const COMPONENT_REGEX = /^\/src\/components\/(?<component>.*)\.(astro|jsx)$/;

export default () => {
  return {
    name: "vite-plugin-astro-bookshop",
    enforce: "pre",

    transform(src, id) {
      id = id.replace(cwd(), "");

      const layoutMatch = id.match(LAYOUT_REGEX);
      const componentMatch = id.match(COMPONENT_REGEX);

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

      if (id.endsWith(".jsx")) {
        return {
          code: processReactJSX(src, componentName),
        };
      }

      return { code: processAstro(src, componentName) };
    },
  };
};
