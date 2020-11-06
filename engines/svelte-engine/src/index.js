const svelteEngine = {
  name: "svelte",
  render: (component, props, options) => {
    window.svelteApps = window.svelteApps || {};
    if (!options.newComponentRender && window.svelteApps[options.uniqueKey]) {
      window.svelteApps[options.uniqueKey].$$set(props);
    } else {
      options.renderRoot.innerHTML = "";

      const app = new options.svelte.svelteApp({
        target: options.renderRoot,
        props: props,
      });
      window.svelteApps[options.uniqueKey] = app;
    }
  },
  init: (name, sv) => {
    let initSvelteApp = "";
    if (sv) {
      initSvelteApp = `
        try {
          SVELTE_APP = require("${sv}").default;
        } catch (e) {console.error(e)}`;
    }
    return `
      const { svelteEngine: ${name} } = require("@bookshop/svelte-engine");
      let SVELTE_APP;
      ${initSvelteApp}`;
  },
  options: () => `{ svelteApp: SVELTE_APP }`,
};

module.exports = {
  svelteEngine: svelteEngine,
};
