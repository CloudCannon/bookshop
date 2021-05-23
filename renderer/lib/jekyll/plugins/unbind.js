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
	  	for (let i = 0; i < ctx.scopes.length; i++) {
	  		if (typeof ctx.scopes[i].bind === 'object') {
	  			ctx.scopes[i] = {
	  				...ctx.scopes[i].bind,
	  				...ctx.scopes[i]
	  			}
	  		}
	  	}
		return ``;
	  }
	});
}