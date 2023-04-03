import server from "@astrojs/react/server.js";
import { getDataBinding } from "@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js";

const renderToStaticMarkup = async (
  Component,
  props,
  { default: children, ...slotted },
  metadata
) => {
  const name = Component.__bookshop_name;
  const data_binding_path = getDataBinding(props);
  const propsString = Object.keys(props)
    .filter((prop) => prop !== "class" && props[prop].__bookshop_path)
    .map((prop) => `${prop}: ${props[prop].__bookshop_path}`)
    .join(",");
  let { html } = await server.renderToStaticMarkup(
    Component,
    props,
    { default: children, ...slotted },
    metadata
  );

  if (name) {
    html = `<!--bookshop-live name(${name}) params(${propsString})-->${html}<!--bookshop-live end-->`;

    if (data_binding_path?.length > 0) {
      html = `<!--databinding:${data_binding_path}-->${html}<!--databindingend:${data_binding_path}-->`;
    }
  }
  return { html };
};

export default {
  check: server.check,
  renderToStaticMarkup,
};
