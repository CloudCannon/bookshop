import escodegen from 'escodegen'
import {parse} from 'acorn'

export default () => {
	return {
		name: 'vite-plugin-astro-bookshop',
		enforce: 'pre',

		transform(src, id) {
			const bookshopMatch = id.match(/.*src\/components.*\/(?<component>\w*)\.astro$/)
			const layoutMatch = id.match(/.*src\/layouts.*\/(?<layout>\w*)\.astro$/)
			if(layoutMatch){
				return {
					code: `
					import {processFrontmatter} from '@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js';
					${src.replace(/const Astro2.*$/m, '$&\nif(Astro2.props.frontmatter){ processFrontmatter(Astro2.props.frontmatter);}')}
					`
				}
			}
			if(bookshopMatch){
				const {component} = bookshopMatch.groups
				const tree = parse(`
				import {getDataBinding} from '@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js';
				${src.replace(/const Astro2.*$/m, '$&\nconst data_binding_path = Astro2.props.__bookshop_path || getDataBinding(Astro2.props); delete Astro2.props.__bookshop_path; const commentID = Math.random()')}
				`, {
					sourceType: 'module',
					ecmaVersion: 'latest'
				});
				const componentDecl = tree.body.find((statement) => {
					if(statement.type !== 'VariableDeclaration'){
						return false;
					}

					const decl = statement.declarations.find((declaration) => {
						if(declaration.init?.type !== 'CallExpression'){
							return false;
						}

						return declaration.init.callee.name === '$$createComponent'
					})

					return !!decl
				})

				const props = [];
				const findProps = (obj) => {
					if(!obj){
						return
					}
					if(obj?.type === 'MemberExpression'){
						const {object} = obj;
						if(object?.type ==='MemberExpression' && object?.object?.name === 'Astro2' && object?.property?.name === 'props'){
							if(obj.property?.name && obj.property?.name !== '__bookshop_path' && !props.includes(obj.property?.name)){
								props.push(obj.property.name)
								return;
							}
						}
					}
					Object.values(obj).forEach((val) => {
						if(Array.isArray(val)){
							val.forEach(findProps)
						} else if(typeof val === 'object'){
							findProps(val)
						}
					})
				}
				findProps(tree)

				const process = (obj) => {
					if(!obj){
						return
					}
					if(obj?.type === 'TaggedTemplateExpression' && obj.tag.name === '$$render'){
							const quasis = obj.quasi.quasis;
							const propsString = props.map((prop) => `${prop}:${prop}`).join(',')
							quasis[0].value.raw = `--><!--bookshop-live name(${component}) params(${propsString})-->${quasis[0].value.raw}`
							quasis[0].value.cooked = `--><!--bookshop-live name(${component})-->${quasis[0].value.cooked}`
							quasis[quasis.length-1].value.raw = `${quasis[quasis.length-1].value.raw}<!--bookshop-live end--><!--databindingend:`
							quasis[quasis.length-1].value.cooked = `${quasis[quasis.length-1].value.cooked}<!--bookshop-live end--><!--databindingend:`
							quasis.unshift({
								"type": "TemplateElement",
								"start": 595,
								"end": 595,
								"loc": {
									"start": { "line": 14, "column": 18 },
									"end": { "line": 14, "column": 18 }
								},
								"value": { "raw": "<!--databinding: ", "cooked": "<!--databinding: " },
								"tail": false
							})
							quasis.push({
								"type": "TemplateElement",
								"start": 595,
								"end": 595,
								"loc": {
									"start": { "line": 14, "column": 18 },
									"end": { "line": 14, "column": 18 }
								},
								"value": { "raw": `-->`, "cooked": `-->` },
								"tail": false
							})
							obj.quasi.expressions.unshift({
								"type": "Identifier",
								"start": 682,
								"end": 688,
								"loc": {
									"start": {
										"line": 15,
										"column": 51
									},
									"end": {
										"line": 15,
										"column": 57
									}
								},
								"name": "data_binding_path"
							})
							obj.quasi.expressions.push({
								"type": "Identifier",
								"start": 682,
								"end": 688,
								"loc": {
									"start": {
										"line": 15,
										"column": 51
									},
									"end": {
										"line": 15,
										"column": 57
									}
								},
								"name": "data_binding_path"
							})
							return;
						}
					Object.values(obj).forEach((val) => {
						if(Array.isArray(val)){
							val.forEach(process)
						} else if(typeof val === 'object'){
							process(val)
						}
					})
				}

				process(componentDecl)

				return {
					code: escodegen.generate(tree),
					map: null
				}
			}
		}
	}
}