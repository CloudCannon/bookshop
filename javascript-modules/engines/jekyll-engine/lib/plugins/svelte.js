import * as JSB from 'js-base64';
const Base64 = JSB.Base64;

/**
 * Liquidjs handler for https://github.com/CloudCannon/svelte-slabs
 * TODO: remove once these plugins are configurable.
 */
 export default function (Liquid) {
    this.registerTag('svelte', {
	  parse: function(token){
	  	this.svelteName = token.args.split(' ')[0];
		if (/bind=include/.test(token.args)) this.bindInclude = true;
	  },
	  render: function(ctx, hash) {
		let data = {};
		if (this.bindInclude) {
			data = ctx.scopes[ctx.scopes.length-1]?.include || ctx.environments.include;
		}
		const props = Base64.encode(JSON.stringify(data));
		return `<!-- START custom bookshop Svelte tag for ${this.svelteName} -->\n<div data-svelte-slab="${this.svelteName}" data-bookshop-svelte-props="${props}">`;
	  }
	});
    this.registerTag('endsvelte', {
	  parse: function(token){
	  },
	  render: function(ctx, hash) {
		return `</div>\n<!-- END custom bookshop Svelte tag -->`;
	  }
	});
}