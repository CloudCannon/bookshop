import { parse } from "@babel/parser";
import generate from "@babel/generator";

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

const process = (node, componentName) => {
  if (!node) {
    return;
  }

  if (
    node?.type === "TaggedTemplateExpression" &&
    node.tag.name === "$$render"
  ) {
    findSpreadExpressions(node).forEach((spread) => {
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

    return;
  }

  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      val.forEach((item) => process(item, componentName));
    } else if (typeof val === "object") {
      process(val, componentName);
    }
  });
};

export default (src, componentName) => {
  let name = src.match(/export default (?<export>.*);/)?.groups.export;
  src = src.replace(
    /const Astro2.*$/m,
    `$&
    delete Astro2.props['bookshop:live'];
    delete Astro2.props['bookshop:binding'];
    delete Astro2.props?.__bookshop_path;`
  );

  const tree = parse(src, {
    sourceType: "module",
    ecmaVersion: "latest",
  }).program;

  const componentDecl = tree.body.find((statement) => {
    if (statement.type !== "VariableDeclaration") {
      return false;
    }

    const decl = statement.declarations.find((declaration) => {
      if (declaration.init?.type !== "CallExpression") {
        return false;
      }

      return declaration.init.callee.name === "$$createComponent";
    });

    return !!decl;
  });

  process(componentDecl, componentName);

  src = (generate.default ?? generate)(tree).code;

  if (name) {
    src = `${src}\n${name}.__bookshop_name = "${componentName}";`;
  }
  return src;
};
