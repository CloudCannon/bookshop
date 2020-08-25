// see types of prompts:
// https://github.com/enquirer/enquirer/tree/master/examples
//
let globalName = '';
module.exports = [
  {
    type: 'input',
    name: 'name',
    message: "Component Name",
    validate: name => {
        if (name.length == 0) return `Must supply a component name`;
        if (/\s/.test(name)) return `Component names cannot have whitespace`;
        if (/--/.test(name)) return `Component names cannot contain modifier sequence (--)`;
        if (/__/.test(name)) return `Component names cannot contain element sequence (__)`;
        if (/^c-/.test(name)) return `Don't include the component prefix (c-)`;
        return true;
    },
    format: name => `c-${name}`.toLowerCase(),
    result: name => {
        globalName = name;
        return name.toLowerCase();
    }
  },
  {
    type: 'list',
    name: 'elements',
    message: "BEM elements (Space seperated)",
    hint: '<Enter> to skip',
    separator: /\s/,
    format: vals => {
        return (typeof vals == 'string') ? vals.split(/\s/).map(v => `c-${globalName}__${v}`).join(', ') : vals;
    }
  },
  {
    type: 'list',
    name: 'mods',
    message: "BEM modifiers (Space seperated)",
    hint: '<Enter> to skip',
    separator: /\s/,
    format: vals => {
        return (typeof vals == 'string') ? vals.split(/\s/).map(v => `c-${globalName}--${v}`).join(', ') : vals;
    }
  },
  {
    type: 'multiselect',
    name: 'knobs',
    message: "Storybook Knobs",
    hint: '<Space> to select, <Enter> to skip',
    choices: [
        { name: "Text", value: "text" },
        { name: "Number", value: "number" },
        { name: "Boolean", value: "boolean" },
        { name: "Color", value: "color" },
        { name: "Array", value: "array" },
        { name: "Object", value: "object" },
    ]
  }
]

function exitHandler(options, exitCode) {
    console.log("Component added! Storybook might not catch the event, but saving any file will rebuild.");
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));