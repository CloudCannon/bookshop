import generate from "@babel/generator";
import { parse } from "@babel/parser";

const hasJSXExpression = (node) => {
  let res = false;
  if (!node) {
    return res;
  }
  if (
    node?.type === "CallExpression" &&
    (node?.callee?.name === "_jsx" ||
      node?.callee?.name === "_jsxs" ||
      (node?.callee?.object?.name?.endsWith("React") &&
        node?.callee?.property?.name === "createElement"))
  ) {
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

const findReturnStatements = (node) => {
  let res = [];
  if (!node) {
    return res;
  }
  if (node?.type === "ReturnStatement") {
    const { argument } = node;
    if (
      argument?.type === "CallExpression" &&
      (argument?.callee?.name === "_jsx" ||
        argument?.callee?.name === "_jsxs" ||
        (argument?.callee?.object?.name?.endsWith("React") &&
          argument?.callee?.property?.name === "createElement"))
    ) {
      res.push(node);
    }
    return res;
  }
  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      res = res.concat(val.flatMap(findReturnStatements));
    } else if (typeof val === "object") {
      res = res.concat(findReturnStatements(val));
    }
  });
  return res;
};

const findSpreadExpressions = (node) => {
  let res = [];
  if (!node) {
    return res;
  }
  if (node?.type === "SpreadElement") {
    res.push(node);
    return res;
  }
  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      res = res.concat(val.flatMap(findSpreadExpressions));
    } else if (typeof val === "object") {
      res = res.concat(findSpreadExpressions(val));
    }
  });
  return res;
};

const findFunctionStatements = (node) => {
  let res = [];
  if (!node) {
    return res;
  }
  if (
    node?.type === "FunctionDeclaration" ||
    node?.type === "ArrowFunctionExpression"
  ) {
    if (node.body?.type === "BlockStatement" && hasJSXExpression(node)) {
      res.push(node);
      return res;
    }
  }
  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      res = res.concat(val.flatMap(findFunctionStatements));
    } else if (typeof val === "object") {
      res = res.concat(findFunctionStatements(val));
    }
  });
  return res;
};

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
      node.body.body.unshift(
        ...parse(`
          let __dataBindingPath = __getDataBinding(${name})?'#'+__getDataBinding(${name}):null;
          delete ${name}.__bookshop_path;
          `).program.body
      );
    } else if (node.params[0]?.type === "ObjectPattern") {
      node.params[0].properties.push({
        type: "ObjectProperty",
        key: {
          type: "Identifier",
          name: "__bookshop_path",
        },
        value: {
          type: "Identifier",
          name: "__bookshop_path",
        },
      });
      const propsString = node.params[0].properties
        .filter((property) => property.value.type === "Identifier")
        .map((property) => property.value.name)
        .join(",");
      node.body.body.unshift(
        ...parse(`
          let __dataBindingPath = __bookshop_path?'#'+__bookshop_path:null;
          if(!__dataBindingPath){
            __dataBindingPath = [${propsString}].map(__getDataBinding).find((prop) => !!prop);
          }
          `).program.body
      );
    }
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

    if (
      node.argument.arguments[0].name === "_Fragment" ||
      (node.argument.arguments[0]?.object?.name.endsWith("React") &&
        node.argument.arguments[0]?.property?.name === "createElement")
    ) {
      return;
    }

    if (node.argument.arguments[1].type === "NullLiteral") {
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
            value: {
              type: "Identifier",
              start: 667,
              end: 669,
              name: "__dataBindingPath",
            },
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
        value: {
          type: "Identifier",
          start: 667,
          end: 669,
          name: "__dataBindingPath",
        },
        kind: "init",
      });
    }
  });

  src = (generate.default ?? generate)(tree).code;

  if (name) {
    src = `${src}\n${name}.__bookshop_name = "${componentName}";`;
  }
  return src;
};
