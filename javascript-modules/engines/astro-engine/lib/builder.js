import * as fs from "fs";
import { join, dirname } from "path";
import { transform } from "@astrojs/compiler";
import AstroPluginVite from "@bookshop/vite-plugin-astro-bookshop";
import { resolveConfig } from "vite";
import * as esbuild from "esbuild";
import { sassPlugin, postcssModules } from "esbuild-sass-plugin";

export const extensions = [".astro", ".jsx", ".tsx"];

const { transform: bookshopTransform } = AstroPluginVite({
  __includeErrorBoundaries: true,
  __removeClientDirectives: true,
});

const getEnvironmentDefines = () => {
  return Object.entries(process.env ?? {}).reduce((acc, [key, value]) => {
    if (key.startsWith("PUBLIC_")) {
      acc[`import.meta.env.${key}`] = JSON.stringify(value);
    }
    return acc;
  }, {});
};

const getImportTransform = async () => {
  const config = await resolveConfig({}, "build");
  const environment = config.environments?.client ?? {};
  const plugins = config.environments?.client?.plugins ?? config.plugins;
  let importPlugin = plugins.find(({ name }) => name === "vite:import-glob");
  const fn = importPlugin.transform.handler ?? importPlugin.transform;
  return fn.bind({ environment });
};

export const buildPlugins = [
  sassPlugin({
    filter: /\.module\.(s[ac]ss|css)$/,
    transform: postcssModules({}),
  }),
  sassPlugin({
    filter: /\.(s[ac]ss|css)$/,
  }),
  {
    name: "bookshop-astro",
    async setup(build) {
      let astroConfig;
      let defaultScopedStyleStrategy;
      try {
        const astroPackageJSON = JSON.parse(
          await fs.promises.readFile(
            join(process.cwd(), "node_modules", "astro", "package.json"),
            "utf8",
          ),
        );
        defaultScopedStyleStrategy = astroPackageJSON.version.startsWith("2")
          ? "where"
          : "attribute";
        astroConfig = (await import(join(process.cwd(), "astro.config.mjs")))
          .default;
        astroConfig.output = astroConfig.output ?? "static";

        const root = `${astroConfig.root ?? process.cwd()}/`.replace(
          /\/+/g,
          "/",
        );
        astroConfig.root = new URL(`file://${root}`);
      } catch (err) {
        astroConfig = {};
      }

      if (Array.isArray(astroConfig.integrations)) {
        await Promise.allSettled(
          astroConfig.integrations?.map((integration) => {
            return integration?.hooks?.["astro:config:setup"]?.({
              config: astroConfig,
              logger: {
                info: console.log,
                warn: console.log,
                error: console.log,
                debug: console.log,
              },
              command: "build",
              isRestart: true,
              updateConfig: (config) => {
                if (config?.vite?.plugins) {
                  astroConfig.vite = astroConfig.vite ?? {};
                  astroConfig.vite.plugins = astroConfig.vite.plugins ?? [];
                  astroConfig.vite.plugins.push(...config.vite.plugins);
                }
              },
              addRenderer: () => {},
              addClientDirective: () => {},
              addMiddleware: () => {},
              addDevToolbarApp: () => {},
              addWatchFile: () => {},
              injectScript: () => {},
              injectRoute: () => {},
            });
          }),
        );
      }

      build.onResolve({ filter: /^astro:.*$/ }, async (args) => {
        const type = args.path.replace("astro:", "");
        if (type === "env/client" || type === "env") {
          return { path: "env", namespace: "virtual" };
        }
        if (type === "transitions/client" || type === "transitions") {
          return {
            path: join(dir, "modules", "transitions.js").replace("file:", ""),
          };
        }
        if (
          !["content", "assets", "i18n", "actions", "middleware"].includes(type)
        ) {
          console.error(
            `Error: The 'astro:${type}' module is not supported inside Bookshop components.`,
          );
          throw new Error("Unsupported virtual module");
        }
        let dir = "";
        if (typeof __dirname !== "undefined") {
          dir = __dirname;
        } else {
          dir = dirname(import.meta.url);
        }
        const path = join(dir, "modules", `${type}.js`).replace("file:", "");
        return {
          path,
        };
      });

      build.onResolve({ filter: /.*/ }, async (args) => {
        try {
          if (astroConfig.vite?.plugins) {
            for (const plugin of astroConfig.vite.plugins) {
              if (plugin.resolveId) {
                const result = await plugin.resolveId(args.path);
                if (result) {
                  return { path: result, namespace: "virtual" };
                }
              }
            }
          }
        } catch (err) {
          // Intentionally ignored
        }
      });

      build.onLoad({ filter: /^env$/, namespace: "virtual" }, async (args) => {
        let contents = "";
        Object.entries(astroConfig?.env?.schema ?? {}).forEach(
          ([key, schema]) => {
            if (schema.context !== "client" || schema.access !== "public") {
              return;
            }

            try {
              switch (schema.type) {
                case "boolean":
                  contents += `export const ${key} = ${!!process.env[key]};\n`;
                  break;
                case "number":
                  contents += `export const ${key} = ${Number(process.env[key])};\n`;
                  break;
                default:
                  contents += `export const ${key} = ${JSON.stringify(process.env[key] ?? "")};\n`;
              }
            } catch (e) {
              //Error intentionally ignored
            }
          },
        );
        contents +=
          'export const getSecret = () => console.warn("[Bookshop] getSecret is not supported in Bookshop. Please use an editing fallback instead.");';
        return {
          contents,
          loader: "js",
        };
      });

      build.onLoad({ filter: /\.astro$/, namespace: "style" }, async (args) => {
        let text = await fs.promises.readFile(args.path, "utf8");
        let transformed = await transform(text, {
          internalURL: "astro/runtime/server/index.js",
          filename: args.path.replace(process.cwd(), ""),
          scopedStyleStrategy:
            astroConfig.scopedStyleStrategy ?? defaultScopedStyleStrategy,
        });
        return {
          contents: transformed.css[0],
          loader: "css",
        };
      });
      build.onLoad({ filter: /\.astro$/ }, async (args) => {
        const astroOptions = {
          internalURL: "astro/runtime/server/index.js",
          filename: args.path.replace(process.cwd(), ""),
          scopedStyleStrategy:
            astroConfig.scopedStyleStrategy ?? defaultScopedStyleStrategy,
        };
        let text = await fs.promises.readFile(args.path, "utf8");
        let tsResult;
        try {
          tsResult = await transform(
            text.replace(/<script(.|\n)*?>(.|\n)*?<\/script>/g, ""),
            astroOptions,
          );
        } catch (err) {}

        if (!tsResult) {
          tsResult = await transform(text, astroOptions);
        }

        let jsResult = await esbuild.transform(tsResult.code, {
          loader: "ts",
          target: "esnext",
          sourcemap: false,
          define: { ...getEnvironmentDefines(), ENV_BOOKSHOP_LIVE: "true" },
        });
        let result = bookshopTransform(
          jsResult.code,
          args.path.replace(process.cwd(), ""),
        );

        if (!result) {
          console.warn("Bookshop transform failed:", args.path);
          result = jsResult;
        }

        const importTransform = await getImportTransform();
        let viteResult = await importTransform(result.code, args.path);

        return {
          contents: viteResult?.code ?? result.code,
          loader: "js",
        };
      });
      build.onResolve(
        { filter: /^\/.*\.(svg|png|jpe?g|webp|gif|tiff|avif)/ },
        (args) => {
          return { path: join(process.cwd(), "public", args.path) };
        },
      );
      build.onLoad({ filter: /\.(j|t)sx$/ }, async (args) => {
        let text = await fs.promises.readFile(args.path, "utf8");
        text = `import __React from 'react';\n${text}`;
        let jsResult = await esbuild.transform(text, {
          loader: args.path.endsWith("jsx") ? "jsx" : "tsx",
          jsxFactory: "__React.createElement",
          jsxFragment: "__React.Fragment",
          target: "esnext",
          sourcemap: false,
          define: { ...getEnvironmentDefines(), ENV_BOOKSHOP_LIVE: "true" },
        });

        let result = bookshopTransform(
          jsResult.code,
          args.path.replace(process.cwd(), ""),
        );

        if (!result) {
          console.warn("Bookshop transform failed:", args.path);
          result = jsResult;
        }

        const importTransform = await getImportTransform();
        let viteResult = await importTransform(result.code, args.path);

        return {
          contents: viteResult?.code ?? result.code,
          loader: "js",
        };
      });
      build.onLoad({ filter: /\.ts$/ }, async (args) => {
        let text = await fs.promises.readFile(args.path, "utf8");
        let jsResult = await esbuild.transform(text, {
          loader: "ts",
          target: "esnext",
          sourcemap: false,
          define: { ...getEnvironmentDefines(), ENV_BOOKSHOP_LIVE: "true" },
        });

        const importTransform = await getImportTransform();
        let viteResult = await importTransform(jsResult.code, args.path);

        return {
          contents: viteResult?.code ?? jsResult.code,
          loader: "js",
        };
      });
      build.onLoad(
        {
          filter: /astro(\/|\\)dist(\/|\\)runtime(\/|\\)server(\/|\\)index.js$/,
        },
        async (args) => {
          let text = await fs.promises.readFile(args.path, "utf8");
          return {
            contents: text + "export function createMetadata(){};",
            loader: "js",
          };
        },
      );
      build.onResolve(
        { filter: /\?astro&type=style/, namespace: "file" },
        async (args) => {
          return { path: args.importer, namespace: "style" };
        },
      );

      build.onLoad({ filter: /.*/, namespace: "virtual" }, async (args) => {
        if (astroConfig.vite?.plugins) {
          for (const plugin of astroConfig.vite.plugins) {
            try {
              if (!plugin.load) {
                continue;
              }

              const result = await plugin.load(args.path);
              if (!result) {
                continue;
              }

              if (typeof result !== "string" && !result.code) {
                continue;
              }

              return {
                contents: typeof result === "string" ? result : result.code,
                loader: "js",
              };
            } catch (err) {
              // Intentionally ignored
            }
          }
        }
      });

      build.onLoad({ filter: /.*/ }, async (args) => {
        if (
          args.path.endsWith(".png") ||
          args.path.endsWith(".svg") ||
          args.path.endsWith(".jpg") ||
          args.path.endsWith(".jpeg") ||
          args.path.endsWith(".webp") ||
          args.path.endsWith(".gif") ||
          args.path.endsWith(".tiff") ||
          args.path.endsWith(".avif") ||
          args.path.endsWith(".json") ||
          args.path.endsWith(".ts")
        ) {
          return;
        }
        if (astroConfig.vite?.plugins) {
          let text;
          try {
            text = await fs.promises.readFile(args.path, "utf8");
          } catch (err) {
            return;
          }

          for (const plugin of astroConfig.vite.plugins) {
            try {
              if (!plugin.transform) {
                continue;
              }

              const result = await plugin.transform(
                text,
                args.path.replace(process.cwd(), ""),
              );

              if (!result) {
                continue;
              }

              if (typeof result !== "string" && !result.code) {
                continue;
              }

              return {
                contents: typeof result === "string" ? result : result.code,
                loader: "js",
              };
            } catch (err) {
              // Intentionally ignored
            }
          }
        }
      });
    },
  },
];

export const esbuildConfigFn = (esbuildOptions, options) => {
  esbuildOptions.publicPath = "/_cloudcannon/";
  esbuildOptions.loader = esbuildOptions.loader ?? {};
  esbuildOptions.loader = {
    ".png": "file",
    ".svg": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".webp": "file",
    ".gif": "file",
    ".tiff": "file",
    ".avif": "file",
    ".ts": "ts",
    ...esbuildOptions.loader,
  };
};
