import remarkAutoImport from "@cloudcannon/remark-auto-import";
import mdxProcessFrontmatter from "./mdx-process-frontmatter.js";
import vitePluginBookshop from "@bookshop/vite-plugin-astro-bookshop";

const COMPONENT_REGEX = /(\/|\\)src(\/|\\)components(\/|\\)(?<component>.*)\.(astro|jsx)$/;

export default () => {
  return {
    name: "bookshop",
    hooks: {
      "astro:config:setup": async ({
        updateConfig
      }) => {
        updateConfig({
          markdown: {
            remarkPlugins: [
              [
                remarkAutoImport,
                {
                  directories: ["src/components"],
                  patterns: ["**/*.astro", "**/*.jsx", "**/*.tsx"],
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
                        "@bookshop/astro-bookshop/helpers/frontmatter-helper.js",
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
            plugins: [vitePluginBookshop()],
          },
        });
      },
    },
  };
};
