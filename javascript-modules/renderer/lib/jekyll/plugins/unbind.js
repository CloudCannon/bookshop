/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerTag('unbind', {
	  parse: function(token){
	  },
	  render: function(ctx, hash) {
		const lastScope = ctx.scopes.length - 1;
		if (typeof ctx.scopes[lastScope].bind === 'object') {
			ctx.scopes[lastScope] = {
				...ctx.scopes[lastScope].bind,
				...ctx.scopes[lastScope],
				bind: null
			}
		}
		return ``;
	  }
	});
}