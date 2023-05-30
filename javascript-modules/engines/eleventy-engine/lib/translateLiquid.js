import { Tokenizer } from 'liquidjs';

// Put quotes around rewritten dynamic values. 
// Assuming that if this code is running, the Eleventy build succeeded.
// A _bookshop_{{val}} include without quotes __will__ break in liquidjs,
// but seems to work in Eleventy?
const quoteDynamicNames = (raw) => {
    return raw.replace(
        /\s_bookshop_(include_)?{{(.+)}}\s/,
        (_, include, innards) => {
            return ` "_bookshop_${include || ''}{{${innards}}}" `
        }
    );
}

const rewriteTag = function (token, src, liveMarkup) {
    let raw = token.getText();

    // Skip html and {% end... %} tags
    if (token.kind === 16) return src; // html
    if (token.name && token.name.match(/^end/)) return src;

    if (liveMarkup && token.name && token.name === 'for') {
        raw = `${raw}{% loop_context ${token.args} %}`
    }

    if (liveMarkup && token.name && (token.name === 'assign' || token.name === 'local')) {
        let [, identifier, value] = token.args.match(/^[\r\n\s]*([^=]+?)[\r\n\s]*=[\r\n\s]*([\s\S]+?)[\r\n\s]*$/);
        raw = `${raw}<!--bookshop-live context(${identifier}: (${value}))-->`
    }

    // Rewrite bookshop_include tag to standard includes — within bookshop they're first class
    if (token.name && token.name === 'bookshop_include') {
        let componentName;
        token.name = 'include';
        raw = raw.replace(
            /bookshop_include[\r\n\s]+('|")?(\S+)/,
            (_, quote, component) => {
                componentName = component.replace(/('|")$/, '');
                return `include ${quote || ''}_bookshop_include_${component}`
            }
        );
        raw = quoteDynamicNames(raw);

        if (liveMarkup) {
            let params = token.args.split(' ');
            params.shift();
            raw = `<!--bookshop-live name(${componentName}) params(${params.join(' ')})-->${raw}<!--bookshop-live end-->`
        }
    }

    // Rewrite bookshop tag to standard includes — within bookshop they're first class
    if (token.name && token.name === 'bookshop') {
        let componentName;
        token.name = 'include';
        raw = raw.replace(
            /bookshop[\r\n\s]+('|")?(\S+)/,
            (_, quote, component) => {
                componentName = component.replace(/('|")$/, '');
                return `include ${quote || ''}_bookshop_${component}`
            }
        );
        raw = quoteDynamicNames(raw);

        if (liveMarkup) {
            let params = token.args.split(' ');
            params.shift();
            raw = `<!--bookshop-live name(${componentName}) params(${params.join(' ')})-->${raw}<!--bookshop-live end-->`
        }
    }

    return [
        src.substr(0, token.begin),
        raw,
        src.substr(token.end)
    ].join('');
}

export default function (text, opts) {
    opts = {
        expandBindSyntax: true,
        liveMarkup: true,
        ...opts
    }
    text = text.toString();

    // If this component contains no subcomponents,
    // we don't need to add any special comments as there
    // can be no data bindings within.
    if (!/bookshop/.test(text)) {
        opts.liveMarkup = false;
    }

    const tokenizer = new Tokenizer(text);
    const output = tokenizer.readTopLevelTokens();

    output.reverse().forEach(tag => {
        text = rewriteTag(tag, text, opts.liveMarkup);
    });

    const unbind = opts.expandBindSyntax ? "{% unbind %}" : "";

    return `${unbind}${text}`;
};
