const svelteEngine = {
  name: "svelte",
  render: (component, props, options, context) => {
    window.svelteApps = window.svelteApps || {};
    if (!options.newComponentRender && window.svelteApps[options.uniqueKey]) {
      window.svelteApps[options.uniqueKey].$$set(props);
    } else {
      options.renderRoot.innerHTML = "";

      const app = new context.require.default({
        target: options.renderRoot,
        props: props,
      });
      window.svelteApps[options.uniqueKey] = app;
    }
  },
  init: () => {
    return {
      packageName: "@bookshop/svelte-engine",
      requireFiles: true,
    };
  },
};

module.exports = {
  engine: svelteEngine,
};
