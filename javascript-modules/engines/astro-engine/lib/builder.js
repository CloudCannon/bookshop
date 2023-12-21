import * as fs from "fs";
import { join, dirname } from "path";
import { transform } from "@astrojs/compiler";
import AstroPluginVite from "@bookshop/vite-plugin-astro-bookshop";
import { resolveConfig } from "vite";
import * as esbuild from "esbuild";
import { sassPlugin, postcssModules } from "esbuild-sass-plugin";

export const extensions = [".astro", ".jsx", ".tsx"];

const { transform: bookshopTransform } = AstroPluginVite();

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
            "utf8"
          )
        );
        defaultScopedStyleStrategy = astroPackageJSON.version.startsWith("2")
          ? "where"
          : "attribute";
        astroConfig = (await import(join(process.cwd(), "astro.config.mjs")))
          .default;
      } catch (err) {
        astroConfig = {};
      }

      build.onResolve({ filter: /^astro:.*$/ }, async (args) => {
        const type = args.path.replace("astro:", "");
        if (type !== "content" && type !== "assets") {
          console.error(
            `Error: The 'astro:${type}' module is not supported inside Bookshop components.`
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
        let text = await fs.promises.readFile(args.path, "utf8");
        let tsResult = await transform(text, {
          internalURL: "astro/runtime/server/index.js",
          filename: args.path.replace(process.cwd(), ""),
          scopedStyleStrategy:
            astroConfig.scopedStyleStrategy ?? defaultScopedStyleStrategy,
        });
        let jsResult = await esbuild.transform(tsResult.code, {
          loader: "ts",
          target: "esnext",
          sourcemap: false,
          define: { ENV_BOOKSHOP_LIVE: "true" },
        });
        let result = await bookshopTransform(
          jsResult.code,
          args.path.replace(process.cwd(), "")
        );

        if (!result) {
          console.warn("Bookshop transform failed:", args.path);
          result = jsResult;
        }

        let importTransform = (await resolveConfig({}, "build")).plugins.find(
          ({ name }) => name === "vite:import-glob"
        ).transform;
        let viteResult = await importTransform(result.code, args.path);

        return {
          contents: viteResult?.code ?? result.code,
          loader: "js",
        };
      });
      build.onResolve({ filter: /^\/.*\.(svg|png|jpe?g|webp)/ }, (args) => {
        return { path: join(process.cwd(), "public", args.path) };
      });
      build.onLoad({ filter: /\.(j|t)sx$/ }, async (args) => {
        let text = await fs.promises.readFile(args.path, "utf8");
        text = `import __React from 'react';\n${text}`;
        let jsResult = await esbuild.transform(text, {
          loader: args.path.endsWith("jsx") ? "jsx" : "tsx",
          jsxFactory: "__React.createElement",
          jsxFragment: "__React.Fragment",
          target: "esnext",
          sourcemap: false,
          define: { ENV_BOOKSHOP_LIVE: "true" },
        });

        let result = await bookshopTransform(
          jsResult.code,
          args.path.replace(process.cwd(), "")
        );

        if (!result) {
          console.warn("Bookshop transform failed:", args.path);
          result = jsResult;
        }

        let importTransform = (await resolveConfig({}, "build")).plugins.find(
          ({ name }) => name === "vite:import-glob"
        ).transform;
        let viteResult = await importTransform(result.code, args.path);

        return {
          contents: viteResult?.code ?? result.code,
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
        }
      );
      build.onResolve(
        { filter: /\?astro&type=style/, namespace: "file" },
        async (args) => {
          return { path: args.importer, namespace: "style" };
        }
      );
      build.onLoad({ filter: /.*/ }, async (args) => {
        if (astroConfig.vite?.plugins) {
          const text = await fs.promises.readFile(args.path, "utf8");
          for (const plugin of astroConfig.vite.plugins) {
            if (!plugin.transform) {
              continue;
            }

            const result = await plugin.transform(
              text,
              args.path.replace(process.cwd(), "")
            );

            if (!result) {
              continue;
            }

            if (typeof result !== "string" && !result.code) {
              return;
            }

            return {
              contents: typeof result === "string" ? result : result.code,
              loader: "js",
            };
          }
        }
      });
    },
  },
];

export const esbuildConfigFn = (esbuildOptions, options) => {
  esbuildOptions.loader = esbuildOptions.loader ?? {};
  esbuildOptions.loader = {
    ".png": "file",
    ".svg": "file",
    ".jpg": "file",
    ".jpeg": "file",
    ".webp": "file",
    ...esbuildOptions.loader,
  };
};
