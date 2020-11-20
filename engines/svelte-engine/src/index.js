const svelteEngine = {
  name: "svelte",
  packageName: "@bookshop/svelte-engine",
  render: (component, props, options, context, fileName) => {
    window.svelteApps = window.svelteApps || {};
    if (!options.newComponentRender && window.svelteApps[options.uniqueKey]) {
      window.svelteApps[options.uniqueKey].$$set(props);
    } else {
      options.renderRoot.innerHTML = "";
      const app = new context[component].default({
        target: options.renderRoot,
        props: props,
      });
      window.svelteApps[options.uniqueKey] = app;
    }
  },
};

module.exports = {
  engine: svelteEngine,
};
