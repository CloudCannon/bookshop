import { Tokenizer } from 'liquidjs';

const tokens = {
    END: /{{\s*end\s*}}/,
    LOOP: /{{\s*range\s+(.+?)\s*}}/,
    ASSIGN: /{{\s*(\$\S+)\s+:=\s+(.+?)\s*}}/,
    BOOKSHOP: /{{\s*partial\s+"bookshop(?:_partial)?"\s+\(\s*slice\s+"(.+?)" (.+?)\s*\)\s*}}/,
}

/**
 * Parse a go text/template using the liquidjs parser
 * that we already have in the bundle.
 * All go templating tags will come through as value tokens.
 */
const rewriteTag = function (token, src, liveMarkup) {
    let raw = token.getText();

    // Skip non-value tags
    if (token.kind !== 8) return src;
    if (tokens.END.test(raw)) return src;

    if (liveMarkup && tokens.LOOP.test(raw)) {
        let [, iterator] = raw.match(tokens.LOOP);
        raw = [`{{ $bookshop__live__iterator := 0 }}`,
            `${raw}`,
            `{{ (printf \`<!--bookshop-live context(.: (index (${iterator}) %d))-->\` $bookshop__live__iterator) | safeHTML }}`,
            `{{ $bookshop__live__iterator = (add $bookshop__live__iterator 1) }}`
        ].join('')
    } else if (liveMarkup && tokens.ASSIGN.test(raw)) {
        let [, identifier, value] = raw.match(tokens.ASSIGN);
        raw = `${raw}{{ \`<!--bookshop-live context(${identifier}: ${value})-->\` | safeHTML }}`
    } else if (liveMarkup && tokens.BOOKSHOP.test(raw)) {
        let [, name, params] = raw.match(tokens.BOOKSHOP);
        raw = `{{ \`<!--bookshop-live name(${name}) params(.: ${params})-->\` | safeHTML }}${raw}{{ \`<!--bookshop-live end-->\` | safeHTML }}`
    }

    return [
        src.substr(0, token.begin),
        raw,
        src.substr(token.end)
    ].join('');
}

export default function (text, opts) {
    opts = {
        liveMarkup: true,
        ...opts
    }
    text = text.toString();
    const tokenizer = new Tokenizer(text);
    const output = tokenizer.readTopLevelTokens();

    output.reverse().forEach(tag => {
        text = rewriteTag(tag, text, opts.liveMarkup);
    });

    return text;
};
