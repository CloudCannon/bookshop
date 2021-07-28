/**
 * Rough skeleton for the highlight tag in Jekyll.
 * This won't perform any code highlighting, but should create the same outer DOM structure.
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