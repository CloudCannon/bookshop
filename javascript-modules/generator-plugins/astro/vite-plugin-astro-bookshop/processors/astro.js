import { parse } from "@babel/parser";
import generate from "@babel/generator";

const findProps = (node) => {
  let res = [];
  if (!node) {
    return res;
  }
  if (node?.type === "MemberExpression") {
    const { object } = node;
    if (
      object?.type === "MemberExpression" &&
      object?.object?.name === "Astro2" &&
      object?.property?.name === "props"
    ) {
      if (
        node.property?.name &&
        node.property?.name !== "__bookshop_path" &&
        !res.includes(node.property?.name)
      ) {
        res.push(node.property.name);
        return res;
      }
    }
  }
  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      res = res.concat(val.flatMap(findProps));
    } else if (typeof val === "object") {
      res = res.concat(findProps(val));
    }
  });
  return res;
};

const process = (node, props, componentName) => {
  if (!node) {
    return;
  }

  if (
    node?.type === "TaggedTemplateExpression" &&
    node.tag.name === "$$render"
  ) {
    const propsString = props.map((prop) => `${prop}:${prop} `).join(",");
    const template = parse(
      `$$render\`
        \${$$maybeRenderHead($$result)}
        \${(__should_live_render ? $$render\`<!--bookshop-live name(${componentName}) params(${propsString})-->\`: '')}
        \${(__data_binding_path ? $$render\`<!--databinding:\${__data_binding_path}-->\` : '')}
        \${'REPLACE_ME'}
        \${(__data_binding_path ? $$render\`<!--databindingend:\${__data_binding_path}-->\` : '')}
        \${(__should_live_render ? $$render\`<!--bookshop-live end-->\`: '')}
      \``
        .replace(/(^\s*)|(\s*$)/gm, "")
        .replace(/\n/g, "")
    ).program.body[0].expression;

    template.quasi.expressions[3] = { ...node };
    Object.keys(node).forEach((key) => delete node[key]);
    Object.keys(template).forEach((key) => (node[key] = template[key]));

    return;
  }

  Object.values(node).forEach((val) => {
    if (Array.isArray(val)) {
      val.forEach((item) => process(item, props, componentName));
    } else if (typeof val === "object") {
      process(val, props, componentName);
    }
  });
};

export default (src, componentName) => {
  src = src.replace(
    /const Astro2.*$/m,
    `$&
    const __should_live_render = !!Astro2.props['bookshop:live'];
    delete Astro2.props['bookshop:live'];
		const __data_binding_path = Astro2.props.__bookshop_path || __getDataBinding(Astro2.props);`
  );

  const tree = parse(
    `import { getDataBinding as __getDataBinding } from '@bookshop/astro-bookshop/helpers/frontmatter-helper.js';
		${src}`,
    {
      sourceType: "module",
      ecmaVersion: "latest",
    }
  ).program;

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

  const props = findProps(tree);
  process(componentDecl, props, componentName);

  return (generate.default ?? generate)(tree).code;
};
