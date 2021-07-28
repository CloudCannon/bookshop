const { Tokenizer } = require('liquidjs');

const rewriteTag = function(token, src) {
    let raw = token.getText();

    // Skip html and {% end... %} tags
    if (token.kind === 16) return src; // html
    if (token.name && token.name.match(/^end/)) return src;

    // Cached includes can be treated as includes
    if (token.name && token.name === 'include_cached') raw = raw.replace(/include_cached/, 'include');

    // Rewrite bookshop tag to standard includes — within bookshop they're first class
    if (token.name && token.name === 'bookshop') {
        token.name = 'include';
        raw = raw.replace(
        /bookshop (\S+)/,
        (_, component) => {
            return `include ${component}`
        }
        );
    }

    // Rewrite Jekyll include syntax to match Liquidjs
    // {% include some-file.html prop=value %} --> {% include "some-file.html" prop: value %}
    if (token.name && token.name.match(/^include/)) {
        raw = raw.replace(/=/g, ': ');
        raw = raw.replace(/\%\s+?include\s([^"'][^\s]+)/gi, '% include "$1"');
    }
    
    return [
        src.substr(0, token.begin),
        raw,
        src.substr(token.end)
    ].join('');
}

module.exports = function(text, opts) {
    opts = {
        isInclude: false,
        expandBindSyntax: true,
        ...opts
    }
    text = text.toString();
    const tokenizer = new Tokenizer(text);
    const output = tokenizer.readTopLevelTokens();

    output.reverse().forEach(tag => {
        text = rewriteTag(tag, text);
    });

    const emulateJekyllIncludes = opts.isInclude ? "{% emulate_jekyll %}" : "";
    const unbind = opts.expandBindSyntax ? "{% unbind %}" : "";

    return `${unbind}${emulateJekyllIncludes}${text}`;
};
