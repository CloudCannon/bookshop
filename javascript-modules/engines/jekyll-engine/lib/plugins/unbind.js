/**
 * Liquidjs shim to support the bind syntax that jekyll-bookshop allows
 * i.e. {% bookshop <component> bind=<object> %}
 * Looks for an object on the current scope named bind, and spreads it out into the current scope.
 */
 export default function (Liquid) {
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