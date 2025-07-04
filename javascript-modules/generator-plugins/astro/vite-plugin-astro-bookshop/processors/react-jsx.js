import generate from "@babel/generator";
import { parse } from "@babel/parser";
import {
  findDefinition,
  addParentLinks,
  findSpreadExpressions,
  createFinder,
} from "../helpers/ast-helper.js";

const dataBindingKeys = [
  "dataBinding",
  "_dataBinding",
  "data_binding",
  "_data_binding",
  "editorLink",
  "_editorLink",
  "editor_link",
  "_editor_link",
];

const isJSXNode = (node) => {
  if (node?.type === "JSXElement") {
    return true;
  }

  if (node?.type === "CallExpression") {
    if (node.callee?.name === "_jsx" || node.callee?.name === "_jsxs") {
      return true;
    }

    if (
      node.callee?.object?.name?.endsWith("React") &&
      node.callee?.property?.name === "createElement"
    ) {
      return true;
    }
  }

  return false;
};

const isJSXFragmentNode = (node) => {
  if (node.type === "CallExpression") {
    let arg = node.arguments[0];

    if (arg?.name === "_Fragment") {
      return true;
    }

    if (
      arg?.object?.name.endsWith("React") &&
      arg?.property?.name === "Fragment"
    ) {
      return true;
    }
  }

  return node.type === "JSXFragment";
};

const isJSXComponentNode = (node) => {
  if (node.type === "CallExpression") {
    let arg = node.arguments[0];

    if (arg?.type === "Identifier" && arg?.name !== "_Fragment") {
      return true;
    }

    if (
      arg?.object?.name.endsWith("React") &&
      arg?.property?.name === "createElement"
    ) {
      return true;
    }
  }

  if (
    node.type === "JSXElement" &&
    node.openingElement?.name?.name?.match(/^[A-Z]/)
  ) {
    return true;
  }

  return false;
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

const findComponents = createFinder((node) => {
  if (!isJSXNode(node)) {
    return false;
  }

  return isJSXComponentNode(node);
}, true);

const findDefaultExportDeclaration = createFinder(
  (node) => node.type === "ExportDefaultDeclaration"
);

export default (src, componentName, includeErrorBoundaries) => {
  const tree = parse(src, {
    sourceType: "module",
    ecmaVersion: "latest",
    plugins: ["jsx", "typescript"],
  }).program;

  let name = src.match(
    /__astro_tag_component__\((?<export>.*), "@astrojs\/react"\)/
  )?.groups.export;

  addParentLinks(tree);
  const functionStatements = findFunctionStatements(tree);
  const returnStatements = findReturnStatements(tree);
  const spreadExpressions = findSpreadExpressions(tree);
  const components = findComponents(tree);

  if (!name) {
    const defaultExport = findDefaultExportDeclaration(tree)[0];

    if (!defaultExport) {
      throw new Error("Component file has no exports");
    }

    if (defaultExport.declaration.type === "Identifier") {
      name = defaultExport.declaration.name;
    } else if (defaultExport.declaration.type === "FunctionDeclaration") {
      name = defaultExport.declaration.id.name;
    } else {
      name = componentName.split("/").pop();
      defaultExport.type = "VariableDeclaration";
      defaultExport.declarations = [
        {
          type: "VariableDeclarator",
          id: {
            type: "Identifier",
            name: name,
          },
          init: defaultExport.declaration,
        },
      ];
      defaultExport.kind = "const";
      tree.body.push({
        type: "ExportDefaultDeclaration",
        declaration: {
          type: "Identifier",
          name: name,
        },
      });
    }
  }

  spreadExpressions.forEach((spread) => {
    const { name } = spread.argument;
    if (!name) {
      return;
    }

    spread.argument = parse(`
      (() => {
        if(${name}?.__bookshop_path){
          return {...${name}, __bookshop_path: ${name}.__bookshop_path};
        }
        return ${name};
      })()
    `).program.body[0].expression;
  });

  returnStatements.forEach((returnNode) => {
    const node = returnNode.argument;

    if (isJSXComponentNode(node) || isJSXFragmentNode(node)) {
      return;
    }

    const valueExpression = parse(
      '__data_binding_path?"#"+__data_binding_path: null;'
    ).program.body[0].expression;

    if (node.arguments?.[1]?.type === "NullLiteral") {
      node.arguments[1] = {
        type: "ObjectExpression",
        properties: [
          {
            type: "ObjectProperty",
            key: {
              type: "Identifier",
              name: "'data-cms-bind'",
            },
            value: valueExpression,
            kind: "init",
          },
        ],
      };
    } else if (node.arguments?.[1]?.type === "ObjectExpression") {
      node.arguments[1].properties?.push({
        type: "ObjectProperty",
        key: {
          type: "Identifier",
          name: "'data-cms-bind'",
        },
        value: valueExpression,
        kind: "init",
      });
    } else if (node.openingElement) {
      node.openingElement.attributes = node.openingElement.attributes ?? [];
      node.openingElement.attributes.push({
        type: "JSXAttribute",
        name: {
          type: "JSXIdentifier",
          name: "data-cms-bind",
        },
        value: {
          type: "JSXExpressionContainer",
          expression: valueExpression,
        },
      });
    }
  });

  functionStatements.forEach((node) => {
    let name = "__props";
    if (node.params[0]?.type === "Identifier") {
      ({ name } = node.params[0]);
    } else if (node.params[0]?.type === "ObjectPattern") {
      node.body.body.unshift({
        type: "VariableDeclaration",
        kind: "let",
        declarations: [
          {
            type: "VariableDeclarator",
            id: node.params[0],
            init: {
              type: "Identifier",
              name: "__props",
            },
          },
        ],
      });
    }
    node.params[0] = {
      type: "Identifier",
      name: "___props",
    };
    node.body.body.unshift(
      ...parse(`
        let __data_binding_path =  ${name}?.__data_binding_path ?? ${name}?.__bookshop_path;
          `).program.body
    );
    node.body.body.unshift(
      ...parse(`
        let ${name} = {...___props};
        `).program.body
    );
  });

  components.forEach((node) => {
    const props =
      node.type === "CallExpression"
        ? node.arguments[1].properties
        : node.openingElement.attributes;

    if (!props) {
      return;
    }

    const dataBindingProp = props.find((prop) =>
      dataBindingKeys.includes(prop.name?.name ?? prop.key?.value)
    );

    const shouldDataBind =
      dataBindingProp?.value.expression?.value ??
      dataBindingProp?.value.value ??
      true;

    if (node.type === "CallExpression") {
      node.arguments[1].properties = node.arguments[1].properties.filter(
        (prop) => !dataBindingKeys.includes(prop.key?.value)
      );
    } else {
      node.openingElement.attributes = node.openingElement.attributes.filter(
        (prop) => !dataBindingKeys.includes(prop.name?.name)
      );
    }

    const propsString = props
      .filter((prop) => (prop.name?.name ?? prop.key?.value) !== "class")
      .map((prop) => {
        if (
          prop.type === "SpreadElement" ||
          prop.type === "JSXSpreadAttribute"
        ) {
          const identifier = (generate.default ?? generate)(prop.argument).code;
          return `{key:"bind", identifiers: ["${identifier}"], values: [${identifier}]}`;
        } else if (prop.value.type.endsWith("Literal")) {
          const value = (generate.default ?? generate)(prop.value).code;
          return `{key:"${prop.key.name}", values: [${value}]}`;
        } else if (prop.value.expression?.type.endsWith("Literal")) {
          const value = (generate.default ?? generate)(
            prop.value.expression
          ).code;
          return `{key:"${prop.name.name}", values: [${value}]}`;
        } else {
          let identifiers = [];
          let curr = prop.value.expression ?? prop.value;

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
          return `{key:"${
            prop.name?.name ?? prop.key?.name
          }", values: [${identifiers
            .join(",")
            .replace(".[", "[")}],  identifiers: [\`${identifiers
            .join("`,`")
            .replace(".[", ".${")
            .replace("]", "}")}\`]}`;
        }
      })
      .join(",");

    if (shouldDataBind && isJSXComponentNode(node)) {
      node.arguments?.[1].properties.push({
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

      node.openingElement?.attributes.push({
        type: "JSXAttribute",
        name: {
          type: "JSXIdentifier",
          name: "__data_binding_path",
        },
        value: {
          type: "JSXExpressionContainer",
          expression: {
            type: "Identifier",
            name: "bookshop_path",
          },
        },
      });
    }

    let template = parse(
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
        return REPLACE_ME;
      })()`
        .replace(/(^\s*)|(\s*$)/gm, "")
        .replace(/\n/g, "")
    ).program.body[0].expression;

    template.callee.body.body[template.callee.body.body.length - 1].argument = {
      ...node,
    };

    if (
      node.parent?.type.startsWith("JSX") &&
      node.parent?.type !== "JSXExpressionContainer"
    ) {
      template = {
        type: "JSXExpressionContainer",
        expression: template,
      };
    }

    Object.keys(node).forEach((key) => delete node[key]);
    Object.keys(template).forEach((key) => (node[key] = template[key]));
    // You have to reparse the tree to ensure that the parent links are updated
    addParentLinks(tree);
  });

  if (includeErrorBoundaries) {
    functionStatements.forEach((node) => {
      const handler = parse(`() => {
      try{

      } catch (__err){
        console.error(__err);
        return __React.createElement("div", {style: {border: '3px solid red', borderRadius: '2px', backgroundColor: "#F99", padding: "4px"}}, [
          __React.createElement("p", {key: 0, style: {fontSize: "18px", "fontWeight": "600"}}, ["Error rendering ${
            componentName ?? "Unknown"
          }!"]),
          __React.createElement("p", {key: 1, style: {fontSize: "16px", "fontWeight": "normal"}}, [__err.message])
        ]);
        
      }
    };`).program.body[0].expression.body.body;
      handler[0].block.body = node.body.body;
      node.body.body = handler;
    });
  }

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
