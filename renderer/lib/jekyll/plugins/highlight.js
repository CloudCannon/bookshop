/**
 * Inside the plugin function, `this` refers to the Liquid instance.
 *
 * @param Liquid: provides facilities to implement tags and filters.
 */
module.exports = function (Liquid) {
    this.registerTag('highlight', {
	  parse: function(token){
        this.lang = token.args.split(' ')[0];
	  },
	  render: function(ctx, hash) {
		return `<figure class="highlight"><pre><code class="language-${this.lang}" data-lang="${this.lang}">`;
	  }
	});
    this.registerTag('endhighlight', {
	  parse: function(token){
	  },
	  render: function(ctx, hash) {
		return `</code></pre></figure>`;
	  }
	});
}