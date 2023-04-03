import escodegen from "escodegen";
import { parse } from "acorn";

const findProps = (node) => {
	const res = [];
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
				!props.includes(node.property?.name)
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
		const quasis = node.quasi.quasis;
		const propsString = props.map((prop) => `${prop}:${prop} `).join(",");
		quasis[0].value.raw = `--><!--bookshop-live name(${component}) params(${propsString})-->${quasis[0].value.raw}`;
		quasis[0].value.cooked = `--><!--bookshop-live name(${component})-->${quasis[0].value.cooked} `;
		quasis[quasis.length - 1].value.raw = `${
			quasis[quasis.length - 1].value.raw
		}<!--bookshop-live end--><!--databindingend: `;
		quasis[quasis.length - 1].value.cooked = `${
			quasis[quasis.length - 1].value.cooked
		}<!--bookshop-live end--><!--databindingend: `;
		quasis.unshift({
			type: "TemplateElement",
			start: 595,
			end: 595,
			loc: {
				start: { line: 14, column: 18 },
				end: { line: 14, column: 18 },
			},
			value: { raw: "<!--databinding: ", cooked: "<!--databinding: " },
			tail: false,
		});
		quasis.push({
			type: "TemplateElement",
			start: 595,
			end: 595,
			loc: {
				start: { line: 14, column: 18 },
				end: { line: 14, column: 18 },
			},
			value: { raw: `-->`, cooked: `-->` },
			tail: false,
		});
		node.quasi.expressions.unshift({
			type: "Identifier",
			start: 682,
			end: 688,
			loc: {
				start: {
					line: 15,
					column: 51,
				},
				end: {
					line: 15,
					column: 57,
				},
			},
			name: "data_binding_path",
		});
		node.quasi.expressions.push({
			type: "Identifier",
			start: 682,
			end: 688,
			loc: {
				start: {
					line: 15,
					column: 51,
				},
				end: {
					line: 15,
					column: 57,
				},
			},
			name: "data_binding_path",
		});
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
		const data_binding_path = Astro2.props.__bookshop_path || getDataBinding(Astro2.props);
		delete Astro2.props.__bookshop_path;
		const commentID = Math.random()`
  );

  const tree = parse(
    `import { getDataBinding } from '@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js';
		${src}`,
    {
      sourceType: "module",
      ecmaVersion: "latest",
    }
  );

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

  return escodegen.generate(tree);
};
