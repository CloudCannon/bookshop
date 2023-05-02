import { parse } from "@babel/parser";
import generate from "@babel/generator";

const addParentLinks = (node) => {
  if (!node) {
    return;
  }
  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      val.forEach((item) => {
        if (item && typeof item === "object") {
          Object.defineProperty(item, "parent", {
            enumerable: false,
            writable: true,
            value: node,
          });
          addParentLinks(item);
        }
      });
    } else if (val && typeof val === "object") {
      Object.defineProperty(val, "parent", {
        enumerable: false,
        writable: true,
        value: node,
      });
      addParentLinks(val);
    }
  });
};

const findDefinition = (node) => {
  let curr = node;

  while (curr) {
    if (curr.type === "BlockStatement") {
      const decl = curr.body.find(({ declarations }) =>
        declarations?.find(({ id }) => id.name === node.name)
      );
      if (decl) {
        const declarator = decl.declarations.find(
          ({ id }) => id.name === node.name
        );
        if (
          declarator.init.type === "MemberExpression" ||
          declarator.init.type === "Identifier"
        ) {
          return declarator.init;
        }
      }
      const destructures = curr.body.filter(({ declarations }) =>
        declarations?.find(({ id }) => id.type === "ObjectPattern")
      );
      const patternDecls = destructures.flatMap(
        ({ declarations }) => declarations
      );
      const patternDecl = patternDecls.find(({ id }) =>
        id.properties.find(({ value }) => value.name === node.name)
      );
      if (patternDecl) {
        if (
          patternDecl.init.type === "MemberExpression" ||
          patternDecl.init.type === "Identifier"
        ) {
          const prop = patternDecl.id.properties.find(
            ({ value }) => value.name === node.name
          );
          return {
            type: "MemberExpression",
            object: patternDecl.init,
            property: {
              type: "Identifier",
              name: prop.key.name,
            },
          };
        }
      }
    }

    if (
      curr.parent?.type === "CallExpression" &&
      curr.parent?.callee.property?.name === "map" &&
      curr.type === "ArrowFunctionExpression"
    ) {
      let func = curr.parent;
      let index = func.arguments[0]?.params[1]?.name ?? "__arg1";
      while (func.arguments[0].params.length < 2) {
        func.arguments[0].params.push({
          type: "Identifier",
          name: `__arg${func.arguments[0].params.length}`,
        });
      }

      return {
        type: "MemberExpression",
        object: func.callee.object,
        property: {
          type: "Identifier",
          name: `[${index}]`,
        },
      };
    }
    curr = curr.parent;
  }
  return null;
};

const findComponents = (node) => {
  let res = [];
  if (!node) {
    return res;
  }
  if (
    node?.type === "CallExpression" &&
    node.callee?.name === "$$renderComponent"
  ) {
    res.push(node);
  }
  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      res = res.concat(val.flatMap(findComponents));
    } else if (typeof val === "object") {
      res = res.concat(findComponents(val));
    }
  });
  return res;
};

export default (src) => {
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

    node.arguments[3].properties = node.arguments[3].properties.filter(
      (prop) =>
        prop.key?.value !== "bookshop:live" &&
        prop.key?.value !== "bookshop:binding"
    );
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
            .replace(".[", "[")}],  identifiers: [\`${identifiers
            .join("`,`")
            .replace(".[", ".${")
            .replace("]", "}")}\`]}`;
        }
      })
      .join(",");
    const template = parse(
      `(async () => {
        const bookshop_paths = [${propsString}].map(({key, identifiers, values}) => {
          if(values[0]?.__bookshop_path){
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
        const params = bookshop_paths.map(({key, path}) => key+':'+path).join(',');
        const bookshop_path = bookshop_paths.filter(({literal}) => !literal)[0]?.path;
        return $$render\`
        \${(typeof $$maybeRenderHead !== 'undefined') ? $$maybeRenderHead($$result) : ''}
        \${(${shouldDataBind} && bookshop_path) ? $$render\`<!--databinding:#\${$$render(bookshop_path)}-->\`: ''}
        \${(${shouldLiveRender} && ${component}.__bookshop_name) ? $$render\`<!--bookshop-live name(\${${component}.__bookshop_name}) params(\${$$render(params)})-->\`: ''}
        \${'REPLACE_ME'}
        \${(${shouldLiveRender} && ${component}.__bookshop_name) ? $$render\`<!--bookshop-live end-->\`: ''}
        \${(${shouldDataBind} && bookshop_path) ? $$render\`<!--databindingend:#\${$$render(bookshop_path)}-->\`: ''}
      \`})()`
        .replace(/(^\s*)|(\s*$)/gm, "")
        .replace(/\n/g, "")
    ).program.body[0].expression;

    template.callee.body.body[
      template.callee.body.body.length - 1
    ].argument.quasi.expressions[3] = { ...node };
    Object.keys(node).forEach((key) => delete node[key]);
    Object.keys(template).forEach((key) => (node[key] = template[key]));
  });

  src = (generate.default ?? generate)(tree).code;

  return src;
};
