/**
 * Liquidjs by default makes all variables passed to an include available directly.
 * This plugin takes the last context and nests it into an object named include,
 * which results in behaviour matching that of Jekyll includes.
 */
export default function (Liquid) {
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