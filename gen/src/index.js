#! /usr/bin/env node

const { runner } = require('hygen')
const { prompt } = require('enquirer');
const Logger = require('hygen/dist/logger').default;
const path = require('path')
const { readdirSync } = require('fs')
const defaultTemplates = path.join(__dirname, 'templates')

let globalName = '';

const gen = async () => {
	let directories = populateDirectories('components');

	let response = await mainPrompt();
	response.directory = await directoryPrompt(directories.components, 'components');



	runner(['component', 'new'], {
	  templates: defaultTemplates,
	  cwd: process.cwd(),
	  logger: new Logger(console.log.bind(console)),
	  createPrompter: () => {
	  	return {
	  		prompt: () => {
		  		return response
		  	}
		  }
	  },
	  exec: (action, body) => {
	    const opts = body && body.length > 0 ? { input: body } : {}
	    return require('execa').shell(action, opts)
	  },
	  debug: !!process.env.DEBUG
	})
}

const mainPrompt = async () => {
	return await prompt([
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
	}, {
	    type: 'list',
	    name: 'elements',
	    message: "BEM elements (Space seperated)",
	    hint: '<Enter> to skip',
	    separator: /\s/,
	    format: vals => {
	        return (typeof vals == 'string') ? vals.split(/\s/).map(v => `c-${globalName}__${v}`).join(', ') : vals;
	    }
	}, {
	    type: 'list',
	    name: 'mods',
	    message: "BEM modifiers (Space seperated)",
	    hint: '<Enter> to skip',
	    separator: /\s/,
	    format: vals => {
	        return (typeof vals == 'string') ? vals.split(/\s/).map(v => `c-${globalName}--${v}`).join(', ') : vals;
	    }
	}, {
	    type: 'list',
	    name: 'states',
	    message: "BEM states (Space seperated)",
	    hint: '<Enter> to skip',
	    separator: /\s/,
	    format: vals => {
	        return (typeof vals == 'string') ? vals.split(/\s/).map(v => `is-${v}`).join(', ') : vals;
	    }
	}, {
	    type: 'multiselect',
	    name: 'knobs',
	    message: "Storybook Knobs",
	    hint: '<Space> to select, <Enter> to skip',
	    indicator(state, choice) {
	        if (choice.enabled) {
	            return '🆕';
	        }
	        return '✖️';
	    },
	    choices: [{
	        name: "Text",
	        value: "text"
	    }, {
	        name: "Number",
	        value: "number"
	    }, {
	        name: "Boolean",
	        value: "boolean"
	    }, {
	        name: "Color",
	        value: "color"
	    }, {
	        name: "Array",
	        value: "array"
	    }, {
	        name: "Object",
	        value: "object"
	    }, ]
	}, {
	    type: 'multiselect',
	    name: 'frameworks',
	    message: "Generate frameworks",
	    hint: '<Space> to select, <Enter> to skip',
	    validate(value) {
	        return value.length === 0 ? `Select at least one framework.` : true;
	    },
	    indicator(state, choice) {
	        if (choice.enabled) {
	            return '🥳';
	        }
	        return '❌';
	    },
	    choices: [{
	        name: "Jekyll",
	        value: "jekyll"
	    }, {
	        name: "Underscore",
	        value: "underscore"
	    }, ]
	}
	]);
}

const directoryPrompt = async (directories, current) => {
	if (directories['_files'] && Object.keys(directories).length == 1) return current;
	delete directories['_files'];

	for (let [k,v] of Object.entries(directories)) {
		if (v['_files'] > 0 && Object.keys(v).length === 1) delete directories[k];
	}

	if (!Object.keys(directories).length) return current;

	let dir = await prompt([{
		type: 'select',
		name: 'dir',
		message: "Where should we put it?",
		choices: [current, ...Object.keys(directories)]
	}]);

	dir = dir.dir;

	if (directories[dir]) {
		return await directoryPrompt(directories[dir], dir);
	}

	return dir;
}


const getDirectories = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

const getFileList = source =>
  readdirSync(source, { withFileTypes: true })
    .filter(fileent => !fileent.isDirectory())
    .map(fileent => fileent.name)


const populateDirectories = (scope) => {
	let files = getFileList(scope);
    let dirs = getDirList(scope);
    dirs = dirs.map(d => populateDirectories(path.join(scope, d)));
    dirs = dirs.reduce(((r, c) => Object.assign(r, c)), {});
    dirs["_files"] = files.length;

    return {
        [scope]: dirs
    }
}

const getDirList = (scope) => {
    return getDirectories(path.join(process.cwd(), scope));
}

gen();