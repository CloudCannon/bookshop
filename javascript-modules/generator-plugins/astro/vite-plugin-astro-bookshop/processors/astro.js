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
        return `{key:"bind", identifier: "${identifier}", value: ${identifier}}`
      } else if(prop.value.type === 'Identifier') {
        const identifier = (generate.default ?? generate)(prop.value).code
        return `{key:"${prop.key.value}", identifier: "${identifier}", value: ${identifier}}`
      } else if(prop.value.type.endsWith("Literal")) {
        const value = (generate.default ?? generate)(prop.value).code
        return `{key:"${prop.key.value}", value: ${value}}`
      }
    })
    .join(',');
    console.log(propsString)
    const template = parse(
      `$$render\`
        \${${component}.__bookshop_name ? $$render\`<!--bookshop-live name(\${${component}.__bookshop_name}) params(\${$$render((()=>{
          return [${propsString}].map(({key, identifier, value}) => {
            if(value.__bookshop_path){
              return key+':'+value.__bookshop_path;
            }

            if(!identifier){
              if(typeof value === 'string'){
                return \`\${key}:"\${value}"\`;
              }
              return key+':'+value;
            }

            if(identifier.startsWith('Astro2.props.frontmatter.')){
              return key+':'+identifier.replace('Astro2.props.frontmatter.', '');
            }

            if(identifier.startsWith('Astro2.props.')){
              return key+':'+identifier.replace('Astro2.props.', '');
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
