const { Tokenizer, assert } = require('liquidjs');

/**
* Inside the plugin function, `this` refers to the Liquid instance.
*
* @param Liquid: provides facilities to implement tags and filters.
*/
module.exports = function (Liquid) {
    this.registerTag('local', {
        parse: function (token) {
            const tokenizer = new Tokenizer(token.args, this.liquid.options.operatorsTrie);
            this.key = tokenizer.readIdentifier().content;
            tokenizer.skipBlank();
            assert(tokenizer.peek() === '=', () => `illegal token ${token.getText()}`);
            tokenizer.advance();
            this.value = tokenizer.remaining();
        },
        render: function(ctx) {
            ctx.scopes[ctx.scopes.length-1][this.key] = this.liquid.evalValueSync(this.value, ctx);
        }
    });
}
