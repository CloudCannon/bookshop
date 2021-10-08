/**
 * Rough skeleton for the highlight tag in Jekyll.
 * This won't perform any code highlighting, but should create the same outer DOM structure.
 * This should also escape any HTML within.
 */

const escapeHtml = (input) => {
    return input
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}

export const liquidHighlight = function (Liquid) {
    this.registerTag('highlight', {
	  parse: function(token, remainingTokens) {
        this.lang = token.args.split(' ')[0];
        this.contents = [];

        const stream = this.liquid.parser.parseStream(remainingTokens)
            .on('tag:endhighlight', () => stream.stop())
            .on('template', (tpl) => this.contents.push(tpl))
            .on('end', () => {
                throw new Error(`tag ${token.raw} not closed`)
            });
        
        stream.start();
	  },
	  render: function*(ctx, hash) {
        const r = this.liquid.renderer;
        const html = yield r.renderTemplates(this.contents, ctx);
        const langAttrs = this.lang
            ? ` class="language-${this.lang}" data-lang="${this.lang}"`
            : '';
		return `<figure class="highlight">
    <pre>
        <code${langAttrs}>
            ${escapeHtml(html)}
        </code>
    </pre>
</figure>`;
	  }
	});
}