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
  let code = src.replace("@astrojs/react", "@bookshop/react");
  let name = code.match(
    /__astro_tag_component__\((?<export>.*), "@bookshop\/react"\)/
  )?.groups.export;

  const tree = parse(
    `import { getDataBinding } from '@bookshop/astro-bookshop/helpers/frontmatter-helper.js';
    ${code}`,
    {
      sourceType: "module",
      ecmaVersion: "latest",
    }
  ).program;

  findFunctionStatements(tree).forEach((node) => {
    node.body.body.unshift(
      parse(
        "try { dataBindingPath = getDataBinding(arguments[0])?'#'+getDataBinding(arguments[0]):null; } catch(e) {}",
        {
          sourceType: "module",
          ecmaVersion: "latest",
        }
      ).program.body[0]
    );
    node.body.body.unshift(
      parse("let dataBindingPath;", {
        sourceType: "module",
        ecmaVersion: "latest",
      }).program.body[0]
    );
  });

  findReturnStatements(tree).forEach((node) => {
    if (
      node.argument.arguments[0].name === "_Fragment" ||
      (node.argument.arguments[0]?.object?.name.endsWith("React") &&
        node.argument.arguments[0]?.property?.name === "createElement")
    ) {
      return;
    }

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
        name: "dataBindingPath",
      },
      kind: "init",
    });
  });

  code = (generate.default ?? generate)(tree).code;

  if (name) {
    code = `${code}\n${name}.__bookshop_name = "${componentName}";`;
  }
  return code;
};
