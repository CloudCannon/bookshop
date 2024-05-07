import remarkAutoImport from "@cloudcannon/remark-auto-import";
import mdxProcessFrontmatter from "./mdx-process-frontmatter.js";
import vitePluginBookshop from "@bookshop/vite-plugin-astro-bookshop";

const COMPONENT_REGEX =
  /(\/|\\)src(\/|\\)components(\/|\\)(?<component>.*)\.(astro|jsx|tsx)$/;

export default (options) => {
  const enableMDX = options?.enableMDX ?? true;
  return {
    name: "bookshop",
    hooks: {
      "astro:config:setup": async ({ updateConfig }) => {
        const config = {
          vite: {
            define: {
              ENV_BOOKSHOP_LIVE: false,
            },
            plugins: [vitePluginBookshop()],
          },
        };
        if (enableMDX) {
          config.markdown = {
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

                    componentName = componentName.replace(/-\w/g, (part) => {
                      return part.slice(1, 2).toUpperCase();
                    })
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
          };
        }
        updateConfig(config);
      },
    },
  };
};
