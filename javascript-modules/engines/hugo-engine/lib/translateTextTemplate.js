import { Tokenizer } from 'liquidjs';

const tokens = {
    END: /{{\s*end\s*}}/,
    BEGIN: /{{\s*(if)/,
    BEGIN_SCOPED: /{{\s*(range|with|define|block|template)/,
    LOOP: /{{\s*range\s+(.+?)\s*}}/,
    INDEX_LOOP: /{{\s*range\s+(\$.+), \$.+ := (.+?)\s*}}/,
    ASSIGN: /{{\s*(\$\S+)\s+:=\s+(.+?)\s*}}/,
    WITH: /{{\s*with\s+(.+?)\s*}}/,
    BOOKSHOP: /{{\s*partial\s+"bookshop(?:_partial)?"\s+\(\s*slice\s+"(.+?)" (.+?)\s*\)\s*}}/,
    BOOKSHOP_SCOPED: /{{\s*partial\s+"bookshop(?:_partial)?"\s+\(?\s*\.\s*\)?\s*}}/,
}

/**
 * Parse a go text/template using the liquidjs parser
 * that we already have in the bundle.
 * All go templating tags will come through as value tokens.
 */
const rewriteTag = function (token, src, endTags, liveMarkup) {
    let raw = token.getText();
    let outputToken = {
        text: raw
    }

    // Skip non-value tags
    if (token.kind !== 8) return outputToken;
    if (tokens.END.test(raw)) {
        endTags.push(outputToken);
        return outputToken;
    }

    if (tokens.BEGIN.test(raw)) {
        endTags.pop();
    }

    if (tokens.BEGIN_SCOPED.test(raw)) {
        outputToken.text = `${outputToken.text}{{ \`<!--bookshop-live stack-->\` | safeHTML }}`;

        let matchingEnd = endTags.pop();
        matchingEnd.text = `{{ \`<!--bookshop-live unstack-->\` | safeHTML }}${matchingEnd.text}`;
    }

    if (liveMarkup && tokens.INDEX_LOOP.test(raw)) {
        let [, index_variable, iterator] = raw.match(tokens.INDEX_LOOP);
        outputToken.text = [`${outputToken.text}`,
        `{{ (printf \`<!--bookshop-live context(.: (index (${iterator}) %d))-->\` ${index_variable}) | safeHTML }}`
        ].join('')
    } else if (liveMarkup && tokens.LOOP.test(raw)) {
        let [, iterator] = raw.match(tokens.LOOP);
        outputToken.text = [`{{ $bookshop__live__iterator := 0 }}`,
            `${outputToken.text}`,
            `{{ (printf \`<!--bookshop-live context(.: (index (${iterator}) %d))-->\` $bookshop__live__iterator) | safeHTML }}`,
            `{{ $bookshop__live__iterator = (add $bookshop__live__iterator 1) }}`
        ].join('')
    } else if (liveMarkup && tokens.ASSIGN.test(raw)) {
        let [, identifier, value] = raw.match(tokens.ASSIGN);
        outputToken.text = `${outputToken.text}{{ \`<!--bookshop-live context(${identifier}: ${value})-->\` | safeHTML }}`
    } else if (liveMarkup && tokens.WITH.test(raw)) {
        let [, value] = raw.match(tokens.WITH);
        outputToken.text = `${outputToken.text}{{ \`<!--bookshop-live context(.: ${value})-->\` | safeHTML }}`
    } else if (liveMarkup && tokens.BOOKSHOP.test(raw)) {
        let [, name, params] = raw.match(tokens.BOOKSHOP);
        outputToken.text = `{{ \`<!--bookshop-live name(${name}) params(.: ${params})-->\` | safeHTML }}${outputToken.text}{{ \`<!--bookshop-live end-->\` | safeHTML }}`
    } else if (liveMarkup && tokens.BOOKSHOP_SCOPED.test(raw)) {
        outputToken.text = [`{{ if reflect.IsSlice . }}{{ (printf \`<!--bookshop-live name(%s) params(.: .)-->\` (index . 0)) | safeHTML }}`,
            `{{- else if reflect.IsMap . -}}{{ (printf \`<!--bookshop-live name(%s) params(.: .)-->\` ._bookshop_name) | safeHTML }}{{ end }}`,
            `${outputToken.text}`,
            `{{ \`<!--bookshop-live end-->\` | safeHTML }}`
        ].join('');
    }

    return outputToken;
}

export default function (text, opts) {
    opts = {
        liveMarkup: true,
        ...opts
    }
    const tokenizer = new Tokenizer(text.toString());
    const tokens = tokenizer.readTopLevelTokens();
    const output = [];
    const endTags = [];

    tokens.reverse().forEach(tag => {
        output.unshift(rewriteTag(tag, text, endTags, opts.liveMarkup));
    });

    return output.map(t => t.text).join('');
};
