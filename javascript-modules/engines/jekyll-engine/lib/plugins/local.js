import { Tokenizer, assert } from 'liquidjs';

/**
* Liquidjs implementation of https://github.com/bglw/jekyll-local-assign
* Assigns variables that don't live on the global scope
*/
export default function (Liquid) {
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
