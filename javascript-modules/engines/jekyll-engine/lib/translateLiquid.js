import { Tokenizer } from 'liquidjs';

const rewriteTag = function(token, src, liveMarkup) {
    let raw = token.getText();

    // Skip html and {% end... %} tags
    if (token.kind === 16) return src; // html
    if (token.name && token.name.match(/^end/)) return src;

    // Cached includes can be treated as includes
    if (token.name && token.name === 'include_cached') raw = raw.replace(/include_cached/, 'include');

    if (liveMarkup && token.name && token.name === 'for'){
        raw = `${raw}{% loop_context ${token.args} %}`
    }

    if (liveMarkup && token.name && (token.name === 'assign' || token.name === 'local')){
        let identifier = token.args.split('=').shift().trim();
        raw = `${raw}<!--bookshop-live context(${identifier}="{{${identifier}}}")-->`
    }

    // Rewrite bookshop_include tag to standard includes — within bookshop they're first class
    if (token.name && token.name === 'bookshop_include') {
        let componentName;
        token.name = 'include';
        raw = raw.replace(
        /bookshop_include (\S+)/,
        (_, component) => {
            componentName = component
            return `include _bookshop_include_${component}`
        }
        );
        if (liveMarkup) {
            let params = token.args.split(' ');
            params.shift();
            raw = `<!--bookshop-live name(${componentName}) params(${params.join(' ').replace(/\binclude\./g, '')})-->${raw}<!--bookshop-live end-->`
        }
    }

    // Rewrite bookshop tag to standard includes — within bookshop they're first class
    if (token.name && token.name === 'bookshop') {
        let componentName;
        token.name = 'include';
        raw = raw.replace(
        /bookshop (\S+)/,
        (_, component) => {
            componentName = component;
            return `include _bookshop_${component}`
        }
        );
        if (liveMarkup) {
            let params = token.args.split(' ');
            params.shift();
            raw = `<!--bookshop-live name(${componentName}) params(${params.join(' ').replace(/\binclude\./g, '')})-->${raw}<!--bookshop-live end-->`
        }
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

export default function(text, opts) {
    opts = {
        isInclude: false,
        expandBindSyntax: true,
        liveMarkup: true,
        ...opts
    }
    text = text.toString();
    const tokenizer = new Tokenizer(text);
    const output = tokenizer.readTopLevelTokens();

    output.reverse().forEach(tag => {
        text = rewriteTag(tag, text, opts.liveMarkup);
    });

    const emulateJekyllIncludes = opts.isInclude ? "{% emulate_jekyll %}" : "";
    const unbind = opts.expandBindSyntax ? "{% unbind %}" : "";

    return `${unbind}${emulateJekyllIncludes}${text}`;
};
