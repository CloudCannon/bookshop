import fg from 'fast-glob'
import {join} from 'path'

export default () => {
	return (tree, file) => {
		fg.sync(["src/components/**/*.astro"]).forEach((path) => {
			const bookshopMatch = path.match(/.*src\/components.*\/(?<component>\w*)\.astro$/)
			tree.children.unshift({
				"type": "mdxjsEsm",
				"position": {
					"start": { "line": 2, "column": 1, "offset": 1 },
					"end": { "line": 2, "column": 47, "offset": 47 }
				},
				"data": {
					"estree": {
						"type": "Program",
						"start": 1,
						"end": 47,
						"body": [
							{
								"type": "ImportDeclaration",
								"start": 1,
								"end": 47,
								"specifiers": [
									{
										"type": "ImportDefaultSpecifier",
										"start": 8,
										"end": 13,
										"local": {
											"type": "Identifier",
											"start": 8,
											"end": 13,
											"name": bookshopMatch.groups.component,
											"loc": {
												"start": { "line": 2, "column": 7, "offset": 8 },
												"end": { "line": 2, "column": 12, "offset": 13 }
											},
											"range": [8, 13]
										},
										"loc": {
											"start": { "line": 2, "column": 7, "offset": 8 },
											"end": { "line": 2, "column": 12, "offset": 13 }
										},
										"range": [8, 13]
									}
								],
								"source": {
									"type": "Literal",
									"start": 19,
									"end": 46,
									"value": join(file.cwd, path),
									"raw": `\"${join(file.cwd, path)}\"`,
									"loc": {
										"start": { "line": 2, "column": 18, "offset": 19 },
										"end": { "line": 2, "column": 45, "offset": 46 }
									},
									"range": [19, 46]
								},
								"loc": {
									"start": { "line": 2, "column": 0, "offset": 1 },
									"end": { "line": 2, "column": 46, "offset": 47 }
								},
								"range": [1, 47]
							}
						],
						"sourceType": "module",
						"comments": [],
						"loc": {
							"start": { "line": 2, "column": 0, "offset": 1 },
							"end": { "line": 2, "column": 46, "offset": 47 }
						},
						"range": [1, 47]
					}
				}
			})
		})
		tree.children.unshift({
			"type": "mdxjsEsm",
			"value": "import { processFrontmatter } from \"@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js\";",
			"position": {
				"start": { "line": 2, "column": 1, "offset": 1 },
				"end": { "line": 2, "column": 105, "offset": 105 }
			},
			"data": {
				"estree": {
					"type": "Program",
					"start": 1,
					"end": 105,
					"body": [
						{
							"type": "ImportDeclaration",
							"start": 1,
							"end": 105,
							"specifiers": [
								{
									"type": "ImportSpecifier",
									"start": 10,
									"end": 28,
									"imported": {
										"type": "Identifier",
										"start": 11,
										"end": 29,
										"name": "processFrontmatter",
										"loc": {
											"start": { "line": 2, "column": 10, "offset": 11 },
											"end": { "line": 2, "column": 28, "offset": 29 }
										},
										"range": [11, 29]
									},
									"local": {
										"type": "Identifier",
										"start": 11,
										"end": 29,
										"name": "processFrontmatter",
										"loc": {
											"start": { "line": 2, "column": 10, "offset": 11 },
											"end": { "line": 2, "column": 28, "offset": 29 }
										},
										"range": [11, 29]
									},
									"loc": {
										"start": { "line": 2, "column": 9, "offset": 10 },
										"end": { "line": 2, "column": 27, "offset": 28 }
									},
									"range": [10, 28]
								}
							],
							"source": {
								"type": "Literal",
								"start": 36,
								"end": 104,
								"value": "@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js",
								"raw": "\"@bookshop/vite-plugin-astro-bookshop/helpers/frontmatter-helper.js\"",
								"loc": {
									"start": { "line": 2, "column": 35, "offset": 36 },
									"end": { "line": 2, "column": 103, "offset": 104 }
								},
								"range": [36, 104]
							},
							"loc": {
								"start": { "line": 2, "column": 0, "offset": 1 },
								"end": { "line": 2, "column": 104, "offset": 105 }
							},
							"range": [1, 105]
						}
					],
					"sourceType": "module",
					"comments": [],
					"loc": {
						"start": { "line": 2, "column": 0, "offset": 1 },
						"end": { "line": 2, "column": 104, "offset": 105 }
					},
					"range": [1, 105]
				}
			}
		},
		{
			"type": "mdxFlowExpression",
			"value": "processFrontmatter(frontmatter)",
			"position": {
				"start": { "line": 4, "column": 1, "offset": 107 },
				"end": { "line": 4, "column": 34, "offset": 140 }
			},
			"data": {
				"estree": {
					"type": "Program",
					"start": 108,
					"end": 139,
					"body": [
						{
							"type": "ExpressionStatement",
							"expression": {
								"type": "CallExpression",
								"start": 108,
								"end": 139,
								"callee": {
									"type": "Identifier",
									"start": 108,
									"end": 126,
									"name": "processFrontmatter",
									"loc": {
										"start": { "line": 4, "column": 1, "offset": 108 },
										"end": { "line": 4, "column": 19, "offset": 126 }
									},
									"range": [108, 126]
								},
								"arguments": [
									{
										"type": "Identifier",
										"start": 127,
										"end": 138,
										"name": "frontmatter",
										"loc": {
											"start": { "line": 4, "column": 20, "offset": 127 },
											"end": { "line": 4, "column": 31, "offset": 138 }
										},
										"range": [127, 138]
									}
								],
								"optional": false,
								"loc": {
									"start": { "line": 4, "column": 1, "offset": 108 },
									"end": { "line": 4, "column": 32, "offset": 139 }
								},
								"range": [108, 139]
							},
							"start": 108,
							"end": 139,
							"loc": {
								"start": { "line": 4, "column": 1, "offset": 108 },
								"end": { "line": 4, "column": 32, "offset": 139 }
							},
							"range": [108, 139]
						}
					],
					"sourceType": "module",
					"comments": [],
					"loc": {
						"start": { "line": 4, "column": 1, "offset": 108 },
						"end": { "line": 4, "column": 32, "offset": 139 }
					},
					"range": [108, 139]
				}
			}
		})
		return tree
	}
}