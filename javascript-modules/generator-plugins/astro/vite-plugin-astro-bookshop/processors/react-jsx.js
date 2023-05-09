import generate from "@babel/generator";
import { parse } from "@babel/parser";
import {
  findDefinition,
  addParentLinks,
  findSpreadExpressions,
  createFinder,
} from "../helpers/ast-helper.js";

const isJSXNode = (node) => {
  return (
    node?.type === "CallExpression" &&
    (node?.callee?.name === "_jsx" ||
      node?.callee?.name === "_jsxs" ||
      (node?.callee?.object?.name?.endsWith("React") &&
        node?.callee?.property?.name === "createElement"))
  );
};

const isJSXComponentNode = (node) => {
  return (
    node.name === "_Fragment" ||
    (node?.object?.name.endsWith("React") &&
      node?.property?.name === "Fragment") ||
    (node?.object?.name.endsWith("React") &&
      node?.property?.name === "createElement")
  );
};

const hasJSXExpression = (node) => {
  let res = false;
  if (!node) {
    return res;
  }
  if (isJSXNode(node)) {
    return true;
  }
  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      res = res || val.some(hasJSXExpression);
    } else if (typeof val === "object") {
      res = res || hasJSXExpression(val);
    }
  });
  return res;
};

const findReturnStatements = createFinder(
  (node) => node?.type === "ReturnStatement" && isJSXNode(node?.argument),
  false
);

const findFunctionStatements = createFinder(
  (node) =>
    (node?.type === "FunctionDeclaration" ||
      node?.type === "ArrowFunctionExpression") &&
    node.body?.type === "BlockStatement" &&
    hasJSXExpression(node),
  false
);

const findComponents = createFinder(
  (node) => isJSXNode(node) && node.arguments?.[0].type === "Identifier",
  true
);

export default (src, componentName) => {
  let name = src.match(
    /__astro_tag_component__\((?<export>.*), "@astrojs\/react"\)/
  )?.groups.export;

  const tree = parse(
    `import { getDataBinding as __getDataBinding } from '@bookshop/astro-bookshop/helpers/frontmatter-helper.js';
    ${src}`,
    {
      sourceType: "module",
      ecmaVersion: "latest",
    }
  ).program;

  findFunctionStatements(tree).forEach((node) => {
    if (node.params[0]?.type === "Identifier") {
      const { name } = node.params[0];
      node.params[0] = {
        type: "Identifier",
        name: "___props",
      };
      node.body.body.unshift(
        ...parse(`
          ${name}.__bookshop_path = ${name}.__bookshop_path ?? ${name}?.__data_binding_path
          let __data_binding_path =  ${name}.__bookshop_path;
            `).program.body
      );
      node.body.body.unshift(
        ...parse(`
          let ${name} = {...___props};
          `).program.body
      );
    } else if (node.params[0]?.type === "ObjectPattern") {
      const destructure = node.params[0];
      node.params[0] = {
        type: "Identifier",
        name: "___props",
      };
      node.body.body.unshift(
        ...parse(`
        __props.__bookshop_path = __props.__bookshop_path ?? __props?.__data_binding_path
        let __data_binding_path =  __props.__bookshop_path;
          `).program.body
      );
      node.body.body.unshift({
        type: "VariableDeclaration",
        kind: "let",
        declarations: [
          {
            type: "VariableDeclarator",
            id: destructure,
            init: {
              type: "Identifier",
              name: "__props",
            },
          },
        ],
      });
      node.body.body.unshift(
        ...parse(`
          let __props = {...___props};
          `).program.body
      );
    }
  });

  addParentLinks(tree);

  let shouldDataBind = true;

  findComponents(tree).forEach((node) => {
    const shouldDataBind =
      node.arguments[1].properties.find((prop) =>
        [
          "dataBinding",
          "_dataBinding",
          "data_binding",
          "_data_binding",
          "editorLink",
          "_editorLink",
          "editor_link",
          "_editor_link",
        ].includes(prop.key?.value)
      )?.value.value ?? true;

    node.arguments[3].properties = node.arguments[1].properties.filter((prop) =>
      [
        "dataBinding",
        "_dataBinding",
        "data_binding",
        "_data_binding",
        "editorLink",
        "_editorLink",
        "editor_link",
        "_editor_link",
      ].includes(prop.key?.value)
    );

    const propsString = node.arguments[1].properties
      .filter((prop) => prop.key?.value !== "class")
      .map((prop) => {
        if (prop.type === "SpreadElement") {
          const identifier = (generate.default ?? generate)(prop.argument).code;
          return `{key:"bind", identifiers: ["${identifier}"], values: [${identifier}]}`;
        } else if (prop.value.type.endsWith("Literal")) {
          const value = (generate.default ?? generate)(prop.value).code;
          return `{key:"${prop.key.name}", values: [${value}]}`;
        } else {
          let identifiers = [];
          let curr = prop.value;

          while (
            curr.type === "Identifier" ||
            curr.type === "MemberExpression"
          ) {
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
          return `{key:"${prop.key.name}", values: [${identifiers
            .join(",")
            .replace(".[", "[")}],  identifiers: [\`${identifiers
            .join("`,`")
            .replace(".[", ".${")
            .replace("]", "}")}\`]}`;
        }
      })
      .join(",");

    if (shouldDataBind) {
      node.arguments[1].properties.push({
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

    const template = parse(
      `(() => {
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
        const bookshop_path = bookshop_paths.filter(({literal}) => !literal)[0]?.path ;
        return REPLACE_ME;
      })()`
        .replace(/(^\s*)|(\s*$)/gm, "")
        .replace(/\n/g, "")
    ).program.body[0].expression;

    template.callee.body.body[template.callee.body.body.length - 1].argument = {
      ...node,
    };
    Object.keys(node).forEach((key) => delete node[key]);
    Object.keys(template).forEach((key) => (node[key] = template[key]));
  });

  findReturnStatements(tree).forEach((node) => {
    findSpreadExpressions(tree).forEach((spread) => {
      const { name } = spread.argument;
      if (!name) {
        return;
      }

      spread.argument = parse(`
        (() => {
          if(${name}.__bookshop_path){
            return {...${name}, __bookshop_path: ${name}.__bookshop_path};
          }
          return ${name};
        })()
      `).program.body[0].expression;
    });

    if (isJSXComponentNode(node.argument.arguments[0])) {
      return;
    }

    if (shouldDataBind && node.argument.arguments[1].type === "NullLiteral") {
      node.argument.arguments[1] = {
        type: "ObjectExpression",
        properties: [
          {
            type: "ObjectProperty",
            start: 667,
            end: 683,
            method: false,
            shorthand: false,
            computed: false,
            key: {
              type: "Identifier",
              start: 667,
              end: 669,
              name: "'data-cms-bind'",
            },
            value: parse('__data_binding_path?"#"+__data_binding_path: null;')
              .program.body[0].expression,
            kind: "init",
          },
        ],
      };
    } else if (node.argument.arguments[1].type === "ObjectExpression") {
      node.argument.arguments[1].properties?.push({
        type: "ObjectProperty",
        start: 667,
        end: 683,
        method: false,
        shorthand: false,
        computed: false,
        key: {
          type: "Identifier",
          start: 667,
          end: 669,
          name: "'data-cms-bind'",
        },
        value: parse('__data_binding_path?"#"+__data_binding_path: null;')
          .program.body[0].expression,
        kind: "init",
      });
    }
  });

  src = (generate.default ?? generate)(tree).code;

  if (name) {
    src = `${src}
    Object.defineProperty(${name}, "__bookshop_name", {
      enumerable: false,
      writable: true,
      value: "${componentName}",
    });`;
  }
  return src;
};
