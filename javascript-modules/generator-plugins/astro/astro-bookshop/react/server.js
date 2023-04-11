import server from "@astrojs/react/server.js";

const renderToStaticMarkup = async (Component, props, children, metadata) => {
  const name = Component.__bookshop_name;
  const propsString = Object.keys(props)
    .filter((prop) => prop !== "class" && !prop.includes(":"))
    .map((prop) => `${prop}: ${props[prop]?.__bookshop_path ?? prop}`)
    .join(",");
  const shouldLiveRender =
    props["bookshop:live"] || typeof window !== "undefined";
  delete props["bookshop:live"];
  let { html } = await server.renderToStaticMarkup(
    Component,
    props,
    children,
    metadata
  );

  if (name && shouldLiveRender) {
    html = `<!--bookshop-live name(${name}) params(${propsString})-->${html}<!--bookshop-live end-->`;
  }

  return { html };
};

export default {
  check: server.check,
  renderToStaticMarkup,
};
