export default {
	type: "mdxFlowExpression",
	value: "processFrontmatter(frontmatter)",
	position: {
		start: { line: 4, column: 1, offset: 107 },
		end: { line: 4, column: 34, offset: 140 },
	},
	data: {
		estree: {
			type: "Program",
			start: 108,
			end: 139,
			body: [
				{
					type: "ExpressionStatement",
					expression: {
						type: "CallExpression",
						start: 108,
						end: 139,
						callee: {
							type: "Identifier",
							start: 108,
							end: 126,
							name: "processFrontmatter",
							loc: {
								start: { line: 4, column: 1, offset: 108 },
								end: { line: 4, column: 19, offset: 126 },
							},
							range: [108, 126],
						},
						arguments: [
							{
								type: "Identifier",
								start: 127,
								end: 138,
								name: "frontmatter",
								loc: {
									start: { line: 4, column: 20, offset: 127 },
									end: { line: 4, column: 31, offset: 138 },
								},
								range: [127, 138],
							},
						],
						optional: false,
						loc: {
							start: { line: 4, column: 1, offset: 108 },
							end: { line: 4, column: 32, offset: 139 },
						},
						range: [108, 139],
					},
					start: 108,
					end: 139,
					loc: {
						start: { line: 4, column: 1, offset: 108 },
						end: { line: 4, column: 32, offset: 139 },
					},
					range: [108, 139],
				},
			],
			sourceType: "module",
			comments: [],
			loc: {
				start: { line: 4, column: 1, offset: 108 },
				end: { line: 4, column: 32, offset: 139 },
			},
			range: [108, 139],
		},
	},
}