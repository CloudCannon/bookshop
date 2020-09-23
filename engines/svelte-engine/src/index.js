const timeout = ms => new Promise(res => setTimeout(res, ms));

const svelteEngine = {
  render: (component, props, options) => {
    window.svelteApps = window.svelteApps || {};
    if (!options.newComponentRender && window.svelteApps[options.uniqueKey]) {
      window.svelteApps[options.uniqueKey].$$set(props);
    } else {
      options.renderRoot.innerHTML = "";

      const app = new options.svelteApp({
        target: options.renderRoot,
        props: props
      });
      window.svelteApps[options.uniqueKey] = app;
    }
  }
}

module.exports = {
    svelteEngine: svelteEngine
}