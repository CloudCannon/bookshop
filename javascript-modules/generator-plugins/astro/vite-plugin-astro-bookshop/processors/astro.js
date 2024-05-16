import { parse } from "@babel/parser";
import generate from "@babel/generator";
import {
  findDefinition,
  addParentLinks,
  createFinder,
} from "../helpers/ast-helper.js";

const findComponents = createFinder(
  (node) =>
    node?.type === "CallExpression" &&
    node.callee?.name === "$$renderComponent",
  true
);

const findComponentsDefs = createFinder(
  (node) =>
    node?.type === "CallExpression" &&
    node.callee?.name === "$$createComponent",
  true
);

export default (src, componentName, includeErrorBoundaries, removeClientDirectives) => {
  src = src.replace(
    /const Astro2.*$/m,
    `$&
    delete Astro2.props['bookshop:live'];
    delete Astro2.props['bookshop:binding'];
    delete Astro2.props?.__data_binding_path;
    delete Astro2.props?.__bookshop_path;`
  );

  const tree = parse(src, {
    sourceType: "module",
    ecmaVersion: "latest",
  }).program;
  addParentLinks(tree);
  findComponents(tree).forEach((node) => {
    const shouldLiveRender = !!node.arguments[3].properties.find(
      (prop) => prop.key?.value === "bookshop:live"
    );

    const shouldDataBind =
      node.arguments[3].properties.find(
        (prop) => prop.key?.value === "bookshop:binding"
      )?.value.value ?? true;

    let clientRendered = false;
    if(removeClientDirectives){
      clientRendered = node.arguments[3].properties.find((prop) => prop.key?.value.startsWith('client:'));
    }

    node.arguments[3].properties = node.arguments[3].properties.filter(
      (prop) =>
        prop.key?.value !== "bookshop:live" &&
        prop.key?.value !== "bookshop:binding" &&
        (!prop.key?.value.startsWith('client:') || !removeClientDirectives)
    );

    if (clientRendered) {
      node.arguments[3].properties.unshift({
        type: "ObjectProperty",
        method: false,
        key: {
          type: "Identifier",
          name: "__client_rendered",
        },
        computed: false,
        shorthand: false,
        value: {
          type: "BooleanLiteral",
          value: true,
        },
      });
    }

    const component = node.arguments[2].name;
    const propsString = node.arguments[3].properties
      .filter((prop) => prop.key?.value !== "class")
      .map((prop) => {
        if (prop.type === "SpreadElement") {
          const identifier = (generate.default ?? generate)(prop.argument).code;
          return `{key:"bind", identifiers: ["${identifier}"], values: [${identifier}]}`;
        } else if (prop.value.type.endsWith("Literal")) {
          const value = (generate.default ?? generate)(prop.value).code;
          return `{key:"${prop.key.value}", values: [${value}]}`;
        } else {
          let identifiers = [];
          let curr = prop.value;

          while (true) {
            let currIdentifier;
            while (true) {
              currIdentifier = (generate.default ?? generate)(curr).code;
              identifiers.push(currIdentifier);
              if (!curr.object) {
                break;
              }
              curr = curr.object;
            }
            const definition = findDefinition(curr);
            if (!definition) {
              break;
            }
            curr = definition;
            identifiers.pop();
            identifiers = identifiers.map((identifier) => {
              return identifier.replace(
                currIdentifier,
                (generate.default ?? generate)(curr).code
              );
            });
          }
          return `{key:"${prop.key.value}", values: [${identifiers
            .join(",")
            .replaceAll(".[", "[")}],  identifiers: [\`${identifiers
            .join("`,`")
            .replaceAll(".[", ".${")
            .replaceAll("]", "}")}\`]}`;
        }
      })
      .join(",");

    if (shouldDataBind) {
      node.arguments[3].properties.unshift({
        type: "ObjectProperty",
        method: false,
        key: {
          type: "Identifier",
          name: "__data_binding_path",
        },
        computed: false,
        shorthand: false,
        value: {
          type: "Identifier",
          name: "bookshop_path",
        },
      });
    }

    const templateString = `(async () => {
      const bookshop_paths = [${propsString}].map(({key, identifiers, values}) => {
        if(typeof values[0]?.__bookshop_path === 'string'){
          if(values[0].__bookshop_path.length === 0){
            return;
          }
          return {key, path: values[0].__bookshop_path};
        }

        if(!identifiers){
          if(typeof values[0] === 'string'){
            return {key, path: \`"\${values[0]}"\`, literal: true};
          }
          return {key, path: values[0], literal: true};
        }

        const parentIndex = values.findIndex((value) => typeof value?.__bookshop_path === 'string');
        if(parentIndex>=0){
          let path = values[parentIndex].__bookshop_path+identifiers[0].replace(identifiers[parentIndex], '');
          if(path.startsWith('.')){
            path = path.slice(1);
          }
          return {key, path};
        }

        if(identifiers[0].startsWith('Astro2.props.frontmatter.')){
          return {key, path: identifiers[0].replace('Astro2.props.frontmatter.', '')};
        }
      }).filter((item) => !!item);
      ${
        !shouldDataBind
          ? 'bookshop_paths.push({key:"dataBinding", path: "false", literal: true});'
          : ""
      }
      const params = bookshop_paths.map(({key, path}) => key+':'+path).join(' ');
      const bookshop_path = bookshop_paths
        .filter(({literal}) => !literal)
        .reduce((acc, {path}) => {
          if(acc === null){
            return path;
          }
          while(!path.startsWith(acc)){
            acc = acc.replace(/\\.?[^.]*$/, '');
          }
          return acc;
        }, null);
      return $$render\`
      \${(typeof $$maybeRenderHead !== 'undefined') ? $$maybeRenderHead($$result) : ''}
      \${(${shouldDataBind} && bookshop_path !== null) ? $$render\`<!--databinding:#\${$$render(bookshop_path)}-->\`: ''}
      \${(${shouldLiveRender} && ${component}?.__bookshop_name) ? $$render\`<!--bookshop-live name(\${${component}.__bookshop_name}) params(\${$$render(params)})-->\`: ''}
      \${'REPLACE_ME'}
      \${(${shouldLiveRender} && ${component}?.__bookshop_name) ? $$render\`<!--bookshop-live end-->\`: ''}
      \${(${shouldDataBind} && bookshop_path !== null) ? $$render\`<!--databindingend:#\${$$render(bookshop_path)}-->\`: ''}
    \`})()`;

    let template;
    try {
      template = parse(
        templateString.replace(/(^\s*)|(\s*$)/gm, "").replace(/\n/g, "")
      ).program.body[0].expression;
    } catch (err) {
      const bookshopErr = new Error(
        `Failed to parse template string\n${templateString}`
      );
      bookshopErr.originalError = err;
      throw bookshopErr;
    }

    template.callee.body.body[
      template.callee.body.body.length - 1
    ].argument.quasi.expressions[3] = { ...node };
    Object.keys(node).forEach((key) => delete node[key]);
    Object.keys(template).forEach((key) => (node[key] = template[key]));
  });

  if(includeErrorBoundaries){
    findComponentsDefs(tree).forEach((node) => {
      const handler = parse(`() => {
        try{
  
        } catch (__err){
          console.error(__err);
          return $$render\`<div style="border: 3px solid red; border-radius: 2px; background-color: #FF9999; padding: 4px;">
          <p style="font-size: 18px; font-weight: 600;">Error rendering ${componentName ?? 'Unknown'}!</p>
          <p style="font-size: 16px; font-weight: normal;">\${__err.message}</p>
          </div>\`;
        }
      };`).program.body[0].expression.body.body;
      handler[0].block.body = node.arguments[0].body.body
      node.arguments[0].body.body = handler;
    });
  }

  src = (generate.default ?? generate)(tree).code;

  return src;
};
