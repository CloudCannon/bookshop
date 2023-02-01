import { renderToString } from "astro/internal/index.js";
import { processFrontmatter } from "@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper";

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
    // the astrokit plugin can grab them instead of using its Vite import.
    window.__bookshop_astro_files = options.files;

    this.activeApps = [];
  }

  getShared(name) {
    const key = `shared/astro/${name}.astro`;
    return this.files?.[key];
  }

  getComponentKey(name) {
    const base = name.split("/").reverse()[0];
    return `components/${name}/${base}.astro`;
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
    processFrontmatter(props);

    const component = this.getComponent(name);
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
    target.innerHTML = result;
  }

  async eval(str, props = [{}]) {
    return props[0][str];
  }
}
