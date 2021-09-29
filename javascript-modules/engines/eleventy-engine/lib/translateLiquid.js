import { Tokenizer } from 'liquidjs';

const rewriteTag = function(token, src) {
    let raw = token.getText();

    // Skip html and {% end... %} tags
    if (token.kind === 16) return src; // html
    if (token.name && token.name.match(/^end/)) return src;

    // Rewrite bookshop_include tag to standard includes — within bookshop they're first class
    if (token.name && token.name === 'bookshop_include') {
        token.name = 'include';
        raw = raw.replace(
        /bookshop_include ('|")?(\S+)/,
        (_, quote, component) => {
            return `include ${quote||''}_bookshop_include_${component}`
        }
        );
    }

    // Rewrite bookshop tag to standard includes — within bookshop they're first class
    if (token.name && token.name === 'bookshop') {
        token.name = 'include';
        raw = raw.replace(
        /bookshop ('|")?(\S+)/,
        (_, quote, component) => {
            return `include ${quote||''}_bookshop_${component}`
        }
        );
    }

    return [
        src.substr(0, token.begin),
        raw,
        src.substr(token.end)
    ].join('');
}

export default function(text, opts) {
    opts = {
        expandBindSyntax: true,
        ...opts
    }
    text = text.toString();
    const tokenizer = new Tokenizer(text);
    const output = tokenizer.readTopLevelTokens();

    output.reverse().forEach(tag => {
        text = rewriteTag(tag, text);
    });

    const unbind = opts.expandBindSyntax ? "{% unbind %}" : "";

    return `${unbind}${text}`;
};
