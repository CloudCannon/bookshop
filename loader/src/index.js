let path = require('path');
let toml = require('toml');
let ejs = require('ejs');
let changeCase = require("change-case");

const storyTemplate = `
const { jekyllEngine } = require("@bookshop/jekyll-engine");

const jekyllComponent = props => jekyllEngine.renderFileSync("<%= full %>.jekyll.html", props);

export default {
    title: "<%= title %>",
    args: <%- defaults.args %>,
    argTypes: <%- defaults.argTypes %>,
};

<% for(var i=0; i<stories.length; i++) {%>
export const <%= stories[i].name %> = jekyllComponent.bind({});
<%= stories[i].name %>.args = <%- stories[i].args %>;
<%= stories[i].name %>.argTypes = <%- stories[i].argTypes %>;
<% } %>
`;

/**
 * Turn our TOML shorthand into Storybook CSF (Component Story Format)
 * @param  {String} source TOML file contents
 * @return {String}        JS file contents in Storybook CSF
 */
module.exports = function(source) {
  //todo: report meaningful errors
  let data = toml.parse(source);

  let {component, title, full} = getTitleFromPath(this);

  let defaults = {
    args: JSON.stringify(data.defaults),
    argTypes: JSON.stringify(processProps(data.defaults))
  }
  delete data.defaults;

  let stories = [];
  for (let [story, props] of Object.entries(data)) {
    stories.push({
      name: changeCase.camelCase(story),
      args: JSON.stringify(props),
      argTypes: JSON.stringify(processProps(props))
    })
  }

  let t = ejs.render(storyTemplate, { component, title, full, defaults, stories });

  this.callback(null, t);
  return;
}

/**
 * Use the filepath of the TOML file to generate component name & hierarchy
 */
const getTitleFromPath = context => {
  let relativePath = path.relative(context.rootContext, context.resourcePath);
  relativePath = relativePath.split('.')[0];

  let component = path.basename(relativePath);

  let segments = relativePath.split('/');
  segments = Array.from(new Set(segments));
  segments = segments.slice(-3);
  let title = segments.map(segment => changeCase.capitalCase(segment)).join('/');

  return {title, component, full: relativePath};
}

/**
 * Turn TOML fields into @storybook/controls argTypes
 */
const processProps = props => {
  if (!props) return {};
  let argTypes = {};
  Object.entries(props).map(([key, val]) => {
    argTypes[key] = {
      control: {
        type: typeFromVal(val).name
      }
    }
  });
  return argTypes;
};

const typeFromVal = val => {
  if (typeof val === 'undefined') {
    return {
      name:'text',
      value: `""`
    };
  }
  if (typeof val === 'string') {
    if (val[0] === '#') {
      return {
        name:'color',
        value: `"${val}"`
      };
    }
    if (val[0] === '{' || val[0] === '[') {
      return {
        name:'object',
        value: `${val}`
      };
    }
    return {
      name:'text',
      value: `"${val}"`
    };
  }
  if (typeof val === 'boolean') {
    return {
      name:'boolean',
      value: val
    };
  }
  if (typeof val === 'number') {
    return {
      name:'number',
      value: val
    };
  }
  if (Array.isArray(val)) {
    return {
      name:'array',
      value: JSON.stringify(val)
    };
  }
  // todo: Add support for selects in Storybook's controls
  // if (Object.keys(val).length) {
  //   return {
  //     name:'select',
  //     value: JSON.stringify(val)
  //   };
  // }
  return {
    name:'text',
    value: JSON.stringify(val)
  };
}