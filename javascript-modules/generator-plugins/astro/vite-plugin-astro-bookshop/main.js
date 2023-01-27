import escodegen from 'escodegen'

export default () => {
	return {
		name: 'vite-plugin-astro-bookshop',
		enforce: 'pre',

		transform(src, id) {
			const bookshopMatch = id.match(/.*src\/components\/(?<component>\w*)\.astro$/)
			const layoutMatch = id.match(/.*src\/layouts\/(?<layout>\w*)\.astro$/)
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
				const tree = this.parse(`
				import {getDataBinding} from '@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js';
				${src.replace(/const Astro2.*$/m, '$&\nconst data_binding_path = Astro2.props.__bookshop_path || getDataBinding(Astro2.props); delete Astro2.props.__bookshop_path; const commentID = Math.random()')}
				`);
				// writeFileSync(`/Users/tate/Desktop/${component}.src.js`, src)
				// writeFileSync(`/Users/tate/Desktop/${component}.ast.json`, JSON.stringify(tree))
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

				const process = (obj) => {
					if(!obj){
						return
					}
					if(obj?.type === 'TaggedTemplateExpression' && obj.tag.name === '$$render'){
							const quasis = obj.quasi.quasis;
							const scriptStart = `
							<script>
							window.addEventListener("DOMContentLoaded", () => {
								const getTemplateCommentIterator = () => {
									const documentNode = document;
									return documentNode.evaluate(
										"//comment()[contains(.,'`
							const scriptMiddle = `')]",
										documentNode,
										null,
										XPathResult.ANY_TYPE,
										null
									);
								};
						
								const data_binding_path = "`
								const scriptEnd = `";
								if(data_binding_path.length === 0){ return; }
								const iterator = getTemplateCommentIterator();
								const startNode = iterator.iterateNext();
								const endNode = iterator.iterateNext();
								if (!startNode || !endNode) return;
						
								let node = startNode.nextElementSibling;
								while (
									node &&
									(node.compareDocumentPosition(endNode) &
										Node.DOCUMENT_POSITION_FOLLOWING) !==
										0
								) {
									node.dataset.cmsBind = "#"+data_binding_path;
								node = node.nextElementSibling;
									}
									window?.CloudCannon?.refreshInterface?.();
								});
								</script>
							`
							quasis[0].value.raw = `--><!--bookshop-live name(${component})-->${quasis[0].value.raw}`
							quasis[0].value.cooked = `--><!--bookshop-live name(${component})-->${quasis[0].value.cooked}`
							quasis[quasis.length-1].value.raw = `${quasis[quasis.length-1].value.raw}<!--bookshop-live end--><!--`
							quasis[quasis.length-1].value.cooked = `${quasis[quasis.length-1].value.cooked}<!--bookshop-live end--><!--`
							quasis.unshift({
								"type": "TemplateElement",
								"start": 595,
								"end": 595,
								"loc": {
									"start": { "line": 14, "column": 18 },
									"end": { "line": 14, "column": 18 }
								},
								"value": { "raw": scriptStart, "cooked": scriptStart },
								"tail": false
							},
							{
								"type": "TemplateElement",
								"start": 595,
								"end": 595,
								"loc": {
									"start": { "line": 14, "column": 18 },
									"end": { "line": 14, "column": 18 }
								},
								"value": { "raw": scriptMiddle, "cooked": scriptMiddle },
								"tail": false
							},
							{
								"type": "TemplateElement",
								"start": 595,
								"end": 595,
								"loc": {
									"start": { "line": 14, "column": 18 },
									"end": { "line": 14, "column": 18 }
								},
								"value": { "raw": `${scriptEnd}<!--`, "cooked": `${scriptEnd}<!--` },
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
								"name": "commentID"
							},{
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
							},
							{
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
								"name": "commentID"
							},)
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
								"name": "commentID"
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
					ast: tree,
					map: null
				}
			}
		}
	}
}