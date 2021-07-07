/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerTag('emulate_jekyll', {
	  parse: function(token){
	  },
	  render: function(ctx, hash) {
		const lastScope = ctx.scopes.length - 1;
		ctx.scopes[lastScope] = {
			include: ctx.scopes[lastScope]
		};
		return ``;
	  }
	});
}