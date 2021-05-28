const { Liquid, Tokenizer } = require('liquidjs');
import bem from './plugins/bem-mods.js';
import jsonify from './plugins/jsonify.js';
import slugify from './plugins/slugify-plugin.js';
import svelte from './plugins/svelte.js';
import unbind from './plugins/unbind.js';
import highlight from './plugins/highlight.js';

const getEngine = (getFileFn) => {
    const engine = new Liquid({
        fs: {
            readFileSync (file) {
                return "Sync? " + file;
            },
            async readFile (file) {
                let content = getFileFn(file, 'jekyll');
                return rewriteIncludes(content);
            },
            existsSync () {
                return true
            },
            async exists () {
                return true
            },
            resolve(root, file, ext) {
                return file
            }
        }
    });
        
    engine.plugin(bem);
    engine.plugin(jsonify);
    engine.plugin(slugify);
    engine.plugin(svelte);
    engine.plugin(unbind);
    engine.plugin(highlight);

    return async (source, props) => {
        source = rewriteIncludes(source);
        return await engine.parseAndRender(source || "", props);
    }
}

export default getEngine;

const rewriteIncludes = function(text) {
    text = text.toString();
    let tokenizer = new Tokenizer(text);
    let output = tokenizer.readTopLevelTokens();

    output.reverse().forEach(tag => {
    text = rewriteTag(tag, text);
    });

    return `{% unbind %}${text}`;
};

const rewriteTag = function(token, src) {
    let raw = token.getText();
    let length = raw.length;

    if (token.kind === 16) return src; // html
    if (token.name && token.name.match(/^end/)) return src;

    if (token.name && token.name === 'include_cached') raw = raw.replace(/include_cached/, 'include');

    if (token.name && token.name === 'bookshop') {
        token.name = 'include';
        raw = raw.replace(
        /bookshop (\S+)/,
        (_, component) => {
            return `include ${component}`
        }
        );
    }

    if (token.name && token.name.match(/^include/)) {
        raw = raw.replace(/=/g, ': ');
        raw = raw.replace(/include\s([^"'][^\s]+)/gi, 'include "$1"');
    }

    raw = raw.replace(/\binclude\./gi, '');
    
    return [
        src.substr(0, token.begin),
        raw,
        src.substr(token.end)
    ].join('');

}