import { parse } from "@babel/parser";
import generate from "@babel/generator";

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
  findComponents(tree).forEach((node) => {
    if (
      !node.arguments[3].properties.find(
        (prop) => prop.key?.value === "bookshop:live"
      )
    ) {
      return;
    }

    node.arguments[3].properties = node.arguments[3].properties.filter(
      (prop) => prop.key?.value !== "bookshop:live"
    );
    const component = node.arguments[2].name;
    const propsString = node.arguments[3].properties.filter(
      (prop) => prop.key?.value !== "class"
    ).map((prop) =>{
      if(prop.type === 'SpreadElement'){
        const identifier = (generate.default ?? generate)(prop.argument).code
        return `{key:"bind", identifiers: ["${identifier}"], values: [${identifier}]}`
      } else if(prop.value.type.endsWith("Literal")) {
        const value = (generate.default ?? generate)(prop.value).code
        return `{key:"${prop.key.value}", values: [${value}]}`
      } else if(prop.value.type === 'Identifier') {
        const identifier = (generate.default ?? generate)(prop.value).code
        return `{key:"${prop.key.value}", identifiers: ["${identifier}"], values: [${identifier}]}`
      } else if(prop.value.type === 'MemberExpression') {
        const identifier = (generate.default ?? generate)(prop.value).code
        if(identifier.startsWith('Astro2.props.frontmatter.')){
          return `{key:"${prop.key.value}", identifiers: ["${identifier}"], values: [${identifier}]}`
        }
        const identifiers = [identifier];
        let curr = prop.value.object;
        while(curr){
          identifiers.push((generate.default ?? generate)(curr).code)
          curr = curr.object;
        }
        return `{key:"${prop.key.value}", values: [${identifiers.join(',')}],  identifiers: ["${identifiers.join('","')}"]}`
      }
    })
    .join(',');
    const template = parse(
      `$$render\`
        \${${component}.__bookshop_name ? $$render\`<!--bookshop-live name(\${${component}.__bookshop_name}) params(\${$$render((()=>{
          return [${propsString}].map(({key, identifiers, values}) => {
            if(values[0].__bookshop_path){
              return key+':'+values[0].__bookshop_path;
            }

            if(!identifiers){
              if(typeof values[0] === 'string'){
                return \`\${key}:"\${values[0]}"\`;
              }
              return key+':'+values[0];
            }

            const parentIndex = values.findIndex((value) => typeof value.__bookshop_path === 'string');
            if(parentIndex>=0){
              let param = values[parentIndex].__bookshop_path+identifiers[0].replace(identifiers[parentIndex], '');
              if(param.startsWith('.')){
                param = param.slice(1);
              }
              return key+':'+param;
            }

            if(identifiers[0].startsWith('Astro2.props.frontmatter.')){
              return key+':'+identifiers[0].replace('Astro2.props.frontmatter.', '');
            }
          })
          .join(',');
        })())})-->\`: ''}
        \${'REPLACE_ME'}
        \${${component}.__bookshop_name ? $$render\`<!--bookshop-live end-->\`: ''}
      \``
        .replace(/(^\s*)|(\s*$)/gm, "")
        .replace(/\n/g, "")
    ).program.body[0].expression;

    template.quasi.expressions[1] = { ...node };
    Object.keys(node).forEach((key) => delete node[key]);
    Object.keys(template).forEach((key) => (node[key] = template[key]));
  });

  src = (generate.default ?? generate)(tree).code;

  return src
};
