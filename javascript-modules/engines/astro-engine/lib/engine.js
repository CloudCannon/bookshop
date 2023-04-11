import { renderToString } from "astro/internal/index.js";
import { processFrontmatter } from "@bookshop/astro-bookshop/helpers/frontmatter-helper";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server.browser";
import { flushSync } from "react-dom";

export class Engine {
  constructor(options) {
    options = {
      name: "Astro",
      files: {},
      ...options,
    };

    this.key = "astro";
    this.name = options.name;
    this.files = options.files;

    // Hide our files somewhere global so that
    // the astro plugin can grab them instead of using its Vite import.
    window.__bookshop_astro_files = options.files;

    this.activeApps = [];
  }

  getShared(name) {
    const base = name.split("/").reverse()[0];
    const root = `shared/astro/${name}`;
    return (
      Object.keys(this.files).find((key) =>
        key.startsWith(`${root}/${base}`)
      ) ?? Object.keys(this.files).find((key) => key.startsWith(root))
    );
  }

  getComponentKey(name) {
    const base = name.split("/").reverse()[0];
    const root = `components/${name}`;
    return (
      Object.keys(this.files).find((key) =>
        key.startsWith(`${root}/${base}`)
      ) ?? Object.keys(this.files).find((key) => key.startsWith(root))
    );
  }

  getComponent(name) {
    const key = this.getComponentKey(name);
    return this.files?.[key];
  }

  hasComponent(name) {
    const key = this.getComponentKey(name);
    return !!this.files?.[key];
  }

  resolveComponentType(name) {
    if (this.getComponent(name)) return "component";
    if (this.getShared(name)) return "shared";
    return false;
  }

  async render(target, name, props, globals) {
    const key = this.getComponentKey(name) ?? this.getShared(name);

    if (key.endsWith(".astro")) {
      return this.renderAstroComponent(target, key, props, globals);
    } else if (key.endsWith(".jsx")) {
      return this.renderReactComponent(target, key, props, globals);
    }
  }

  async renderReactComponent(target, key, props, globals) {
    const component = this.files?.[key];
    const reactNode = createElement(component, props, null);

    const root = createRoot(target);
    flushSync(() => root.render(reactNode));

    return;
  }

  async renderAstroComponent(target, key, props, globals) {
    const component = this.files?.[key];
    const result = await renderToString(
      {
        styles: new Set(),
        scripts: new Set(),
        links: new Set(),
        propagation: new Map(),
        propagators: new Map(),
        extraHead: [],
        _metadata: {
          hasHydrationScript: false,
          hasRenderedHead: false,
          hasDirectives: new Set(),
          renderers: [
            {
              name: "@bookshop/react",
              ssr: {
                check: () => true,
                renderToStaticMarkup: async (Component, props) => {
                  const reactNode = await Component(props);

                  return { html: renderToStaticMarkup(reactNode) };
                },
              },
            },
          ],
        },
        slots: null,
        props,
        createAstro(astroGlobal, props, slots) {
          return {
            __proto__: astroGlobal,
            props,
            slots,
          };
        },
      },
      component,
      props,
      null
    );
    target.innerHTML = result.replace(/<!--bookshop-live.*-->/g, "");
  }

  async eval(str, props = [{}]) {
    processFrontmatter(props[0]);
    return str.split(".").reduce((curr, key) => curr?.[key], props[0]);
  }
}
