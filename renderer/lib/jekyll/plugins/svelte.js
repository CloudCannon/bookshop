/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerTag('svelte', {
	  parse: function(token){
	  	this.svelteName = token.args.split(' ')[0];
		if (/bind=include/.test(token.args)) this.bindInclude = true;
	  },
	  render: function(ctx, hash) {
		let data = {};
		if (this.bindInclude) {
			data = ctx.environments;
		}
		const props = btoa(JSON.stringify(data));
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