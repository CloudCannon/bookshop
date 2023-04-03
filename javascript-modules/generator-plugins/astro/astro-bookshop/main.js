import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import remarkAutoImport from "@cloudcannon/remark-auto-import";
import mdxProcessFrontmatter from "./mdx-process-frontmatter.js";
import reactRender from "./react/renderer.js";

const COMPONENT_REGEX = /\/src\/components\/(?<component>.*)\.(astro|jsx)$/;

export default () => {
  return {
    name: "bookshop",
    hooks: {
      "astro:config:setup": async ({
        updateConfig,
        injectScript,
        addRenderer,
      }) => {
        const __dirname = path.dirname(fileURLToPath(import.meta.url));

        addRenderer(await reactRender());
        injectScript(
          "page",
          readFileSync(path.join(__dirname, "data-binding.js"))
        );
        updateConfig({
          markdown: {
            remarkPlugins: [
              [
                remarkAutoImport,
                {
                  directories: ["src/components"],
                  patterns: ["**/*.astro", "**/*.jsx"],
                  name: (path) => {
                    const componentMatch = path.match(COMPONENT_REGEX);
                    let { component: componentName } = componentMatch.groups;
                    let parts = componentName.split("/");
                    if (
                      parts.length >= 2 &&
                      parts[parts.length - 1] === parts[parts.length - 2]
                    ) {
                      parts.pop();
                    }
                    componentName = parts
                      .map(
                        (part) => part.slice(0, 1).toUpperCase() + part.slice(1)
                      )
                      .join("");
                    return componentName;
                  },
                  additionals: [
                    {
                      importPath:
                        "@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js",
                      namedImports: [{ name: "processFrontmatter" }],
                    },
                    {
                      tree: mdxProcessFrontmatter,
                    },
                  ],
                },
              ],
            ],
          },
          vite: {
            plugins: [
              (await import("@bookshop/vite-plugin-astro-bookshop")).default(),
            ],
          },
        });
      },
    },
  };
};
