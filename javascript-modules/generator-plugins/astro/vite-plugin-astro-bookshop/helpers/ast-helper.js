import { env } from 'process';

const findDefinitionInner = (node) => {
  let curr = node;

  while (curr) {
    const body = curr.body?.body ?? curr.body;
    if (Array.isArray(body)) {
      const decl = body.find(({ declarations }) =>
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
      const destructures = body.filter(({ declarations }) =>
        declarations?.find(({ id }) => id.type === "ObjectPattern")
      );
      const patternDecls = destructures.flatMap(
        ({ declarations }) => declarations
      );
      const patternDecl = patternDecls.find(({ id }) =>
        id.properties.find(({ value }) => {
          return value?.name === node.name
        })
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
}

export const findDefinition = (node) => {
  try{
    return findDefinitionInner(node)
  } catch (err){
    if(env.BOOKSHOP_VERBOSE){
      console.warn(`[vite-plugin-astro-bookshop] Failed to find definition: ${err}`);
    }
    return null;
  }
};

export const addParentLinks = (node) => {
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

export const createFinder = (filter, recursive = true) => {
  const finder = (node) => {
    let res = [];
    if (!node) {
      return res;
    }
    if (filter(node)) {
      res.push(node);
      if (!recursive) {
        return res;
      }
    }
    Object.values(node).forEach((val) => {
      if (Array.isArray(val)) {
        res = res.concat(val.flatMap(finder));
      } else if (typeof val === "object") {
        res = res.concat(finder(val));
      }
    });
    return res;
  };
  return finder;
};

export const findSpreadExpressions = createFinder(
  ({ type }) => type === "SpreadElement" || type === "JSXSpreadAttribute",
  false
);
