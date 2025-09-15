import {
  renderToString,
  renderSlotToString,
} from "astro/runtime/server/index.js";
import { processFrontmatter } from "@bookshop/astro-bookshop/helpers/frontmatter-helper";
import { createRoot } from "react-dom/client";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server.browser";
import { flushSync } from "react-dom";

export class Engine {
  renderers = [
    {
      name: "dynamic-tags",
      ssr: {
        check: (Component) => {
          return typeof Component === 'string';
        },
        renderToStaticMarkup: async (Component, props, slots) => {
          const propsString = Object.entries(props)
            .map(([key, value]) => `${key}="${value}"`)
            .join(' ');
          return `<${Component} ${propsString}>${slots.default ?? ''}</${Component}>`
        },
      },
    },
    {
      name: "@astrojs/react",
      ssr: {
        check: () => true,
        renderToStaticMarkup: async (Component, props) => {
          const clientRendered = props.__client_rendered;
          delete props.__client_rendered;
          if(clientRendered){
            this.reactRoots.push({Component, props});
            return { html: `<div data-react-root=${this.reactRoots.length-1}></div>` };
          }

          const reactNode = await Component(props);
          return { html: renderToStaticMarkup(reactNode) };
        },
      },
    },
  ];

  constructor(options) {
    options = {
      name: "Astro",
      files: {},
      ...options,
    };

    this.key = "astro";
    this.name = options.name;
    this.files = options.files;
    this.reactRoots = [];

    // Hide our files somewhere global so that
    // the astro plugin can grab them instead of using its Vite import.
    window.__bookshop_astro_files = options.files;
  }

  getSharedKey(name) {
    const base = name.split("/").reverse()[0];
    const root = `shared/astro/${name}`;
    return (
      Object.keys(this.files).find((key) =>
        key.startsWith(`${root}/${base}.`)
      ) ?? Object.keys(this.files).find((key) => key.startsWith(`${root}.`))
    );
  }

  getComponentKey(name) {
    const base = name.split("/").reverse()[0];
    const root = `components/${name}`;
    return (
      Object.keys(this.files).find((key) =>
        key.startsWith(`${root}/${base}.`)
      ) ?? Object.keys(this.files).find((key) => key.startsWith(`${root}.`))
    );
  }

  getComponent(name) {
    const key = this.getComponentKey(name) ?? this.getSharedKey(name);
    return this.files?.[key];
  }

  hasComponent(name) {
    const key = this.getComponentKey(name) ?? this.getSharedKey(name);
    return !!this.files?.[key];
  }

  resolveComponentType(name) {
    if (this.getComponentKey(name)) return "component";
    if (this.getSharedKey(name)) return "shared";
    return false;
  }

  async render(target, name, props, globals) {
    const key = this.getComponentKey(name) ?? this.getSharedKey(name);

    if (key.endsWith(".astro")) {
      return this.renderAstroComponent(target, key, props, globals);
    } else if (key.endsWith(".jsx") || key.endsWith(".tsx")) {
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

    let encryptionKey;
    try{
      encryptionKey = window.crypto.subtle.generateKey(
        {
          name: "AES-GCM",
          length: 256,
        },
        true,
        ["encrypt", "decrypt"],
      )
    } catch(err){
      console.warn("[Bookshop] Could not generate a key for Astro component. This may cause issues with Astro components that use server-islands")
    }

    const SSRResult = {
      styles: new Set(),
      scripts: new Set(),
      links: new Set(),
      propagation: new Map(),
      propagators: new Map(),
      inlinedScripts: new Map(),
      serverIslandNameMap: { get: () => "Bookshop" },
      key: encryptionKey,
      base: "/",
      extraHead: [],
      compressHTML: false,
      partial: false,
      shouldInjectCspMetaTags: false,
      componentMetadata: new Map(),
      renderers: this.renderers,
      _metadata: {
        renderers: this.renderers,
        hasHydrationScript: false,
        hasRenderedHead: true,
        hasRenderedServerIslandRuntime: true,
        hasDirectives: new Set(),
        propagators: new Set(),
        rendererSpecificHydrationScripts: new Set(),
        renderedScripts: new Set(),
        extraHead: [],
        extraStyleHashes: [],
        extraScriptHashes: [],
      },
      clientDirectives: new Map([
	["load", "bookshop-placeholder"],
	["idle", "bookshop-placeholder"],
	["visible", "bookshop-placeholder"],
	["media", "bookshop-placeholder"],
      ]),
      slots: null,
      props,
      createAstro(astroGlobal, props, slots) {
        const astroSlots = {
          has: (name) => {
            if (!slots) return false;
            return Boolean(slots[name]);
          },
          render: (name) => {
            return renderSlotToString(SSRResult, slots[name]);
          },
        };
        return {
          __proto__: astroGlobal,
          props,
          slots: astroSlots,
          request: new Request(window.location),
        };
      },
    };
    const result = await renderToString(SSRResult, component, props, null);
    const doc = document.implementation.createHTMLDocument();
    doc.body.innerHTML = result;
    this.updateBindings(doc);
    target.innerHTML = doc.body.innerHTML;
    target.querySelectorAll('[data-react-root]').forEach((node) => {
      const reactRootId = Number(node.getAttribute('data-react-root'));
      const {Component, props} = this.reactRoots[reactRootId];
      const reactNode = createElement(Component, props, null);
      const root = createRoot(node);
      flushSync(() => root.render(reactNode));
    });
    this.reactRoots = [];
    target.querySelectorAll("link, [data-island-id]").forEach((node) => {
      node.remove();
    });
  }

  async eval(str, props = [{}]) {
    processFrontmatter(props[0]);
    return str.split(".").reduce((curr, key) => curr?.[key], props[0]);
  }

  async storeInfo(info = {}) {
    const collections = info.collections || {};
    for (const [key, val] of Object.entries(collections)) {
      const collectionKey =
        val[0]?.path.match(/^\/?src\/content\/(?<collection>[^/]*)/)?.groups
          .collection ?? key;
      const collection = val.map((item) => {
        let id = item.path.replace(`src/content/${collectionKey}/`, "");
        const slug = id.replace(/\.[^.]*$/, "");
        if (!id.match(/\.md(x|oc)?$/)) {
          id = slug;
        }
        return {
          id,
          collection: collectionKey,
          slug: item.slug ?? slug,
          render: () => () => "Content is not available when live editing",
          body: "Content is not available when live editing",
          data: item,
        };
      });
      collections[key] = collection;
      collections[collectionKey] = collection;
    }

    window.__bookshop_collections = collections;
  }

  getBindingCommentIterator(documentNode) {
    return documentNode.evaluate(
      "//comment()[contains(.,'databinding:')]",
      documentNode,
      null,
      XPathResult.ANY_TYPE,
      null
    );
  }

  getEndingBindingCommentIterator(documentNode, binding) {
    return documentNode.evaluate(
      `//comment()[contains(.,'databindingend:${binding}')]`,
      documentNode,
      null,
      XPathResult.ANY_TYPE,
      null
    );
  }

  updateBindings(documentNode) {
    const iter = this.getBindingCommentIterator(documentNode);
    const nodes = [];
    let current = iter.iterateNext();

    while (current) {
      nodes.push(current);
      current = iter.iterateNext();
    }

    for (current of nodes) {
      const data_binding_path = current.textContent.split(":")[1].trim();
      if (data_binding_path.length > 0) {
        const endIter = this.getEndingBindingCommentIterator(
          documentNode,
          data_binding_path
        );
        let end = endIter.iterateNext();
        while (end) {
          const binding = end.textContent.split(":")[1].trim();
          if (
            (end.compareDocumentPosition(current) &
              Node.DOCUMENT_POSITION_FOLLOWING) ===
              0 &&
            binding === data_binding_path
          ) {
            break;
          }
          end = endIter.iterateNext();
        }

        if (end) {
          let node = current.nextElementSibling;
          while (
            node &&
            (node.compareDocumentPosition(end) &
              Node.DOCUMENT_POSITION_FOLLOWING) !==
              0
          ) {
            node.dataset.cmsBind = node.dataset.cmsBind ?? data_binding_path;
            node = node.nextElementSibling;
          }
        }
      }
    }
  }
}
