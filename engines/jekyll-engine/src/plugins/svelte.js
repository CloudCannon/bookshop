/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerTag('svelte', {
	  parse: function(token){
	  	this.svelteName = token.args.split(' ')[0];
	  },
	  render: function(ctx, hash) {
		return `<!-- START Supressing Svelte tag for ${this.svelteName} -->`;
	  }
	});
    this.registerTag('endsvelte', {
	  parse: function(token){
	  },
	  render: function(ctx, hash) {
		return `<!-- END supressing Svelte tag -->`;
	  }
	});
}