import { Tokenizer } from 'liquidjs';

// Homebrewed pretty-regex writer
const tokens = {
    END: `{{ end }}`,
    BEGIN: `{{ (if)`,
    BEGIN_SCOPED: `{{ (range|with|define|block|template)`,
    LOOP: `{{ range  () }}`,
    INDEX_LOOP: `{{ range  (\\$.+), \\$.+ := () }}`,
    ASSIGN: `{{ (\\$\\S+)  :=  () }}`,
    REASSIGN: `{{ (\\$\\S+)  =  () }}`,
    WITH: `{{ with  () }}`,
    BOOKSHOP: `{{ partial  "bookshop"  \\( slice "()" () \\) }}`,
    BOOKSHOP_SCOPED: `{{ partial  "bookshop"  \\(? \\. \\)? }}`,
}

const TOKENS = {};
Object.entries(tokens).forEach(([name, r]) => {
    TOKENS[name] = new RegExp(r
        .replace(/\(\)/g, '([\\S\\s]+?)')        // Empty capturing group defaults to lazy multiline capture
        .replace(/  /g, '[\\n\\r\\s]+')     // Two spaces actually means one or more blanks
        .replace(/ /g, '[\\n\\r\\s]*'));    // One space means zero or more blanks
});
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
    if (TOKENS.END.test(raw)) {
        endTags.push(outputToken);
        return outputToken;
    }

    if (TOKENS.BEGIN.test(raw)) {
        endTags.pop();
    }

    if (TOKENS.BEGIN_SCOPED.test(raw)) {
        outputToken.text = `${outputToken.text}{{ \`<!--bookshop-live stack-->\` | safeHTML }}`;

        let matchingEnd = endTags.pop();
        matchingEnd.text = `{{ \`<!--bookshop-live unstack-->\` | safeHTML }}${matchingEnd.text}`;
    }

    if (liveMarkup && TOKENS.INDEX_LOOP.test(raw)) {
        let [, index_variable, iterator] = raw.match(TOKENS.INDEX_LOOP);
        const r = required_wrapper_hugo_func(iterator);
        outputToken.text = [`${outputToken.text}`,
        `{{${r[0]} (printf \`<!--bookshop-live context(.: (index (${tidy(iterator)}) %v))-->\` (jsonify ${index_variable}))${r[1]} | safeHTML }}`
        ].join('')
    } else if (liveMarkup && TOKENS.LOOP.test(raw)) {
        let [, iterator] = raw.match(TOKENS.LOOP);
        const r = required_wrapper_hugo_func(iterator);
        outputToken.text = [`{{ $bookshop__live__iterator__keys := (slice) }}`,
            `{{ range $i, $e := (${tidy(iterator)}) }}{{ $bookshop__live__iterator__keys = $bookshop__live__iterator__keys | append $i }}{{ end }}`,
            `{{ $bookshop__live__iterator := 0 }}`,
            `${outputToken.text}`,
            `{{ $bookshop__live__iterator__key := (index ($bookshop__live__iterator__keys) $bookshop__live__iterator) }}`,
            `{{${r[0]} (printf \`<!--bookshop-live context(.: (index (${tidy(iterator)}) %v))-->\` (jsonify $bookshop__live__iterator__key))${r[1]} | safeHTML }}`,
            `{{ $bookshop__live__iterator = (add $bookshop__live__iterator 1) }}`
        ].join('')
    } else if (liveMarkup && TOKENS.ASSIGN.test(raw)) {
        let [, identifier, value] = raw.match(TOKENS.ASSIGN);
        const r = required_wrapper_hugo_func(value);
        outputToken.text = `${outputToken.text}{{${r[0]} \`<!--bookshop-live context(${identifier}: (${tidy(value)}))-->\`${r[1]} | safeHTML }}`
    } else if (liveMarkup && TOKENS.REASSIGN.test(raw)) {
        let [, identifier, value] = raw.match(TOKENS.REASSIGN);
        const r = required_wrapper_hugo_func(value);
        outputToken.text = `${outputToken.text}{{${r[0]} \`<!--bookshop-live reassign(${identifier}: (${tidy(value)}))-->\`${r[1]} | safeHTML }}`
    } else if (liveMarkup && TOKENS.WITH.test(raw)) {
        let [, value] = raw.match(TOKENS.WITH);
        const r = required_wrapper_hugo_func(value);
        outputToken.text = `${outputToken.text}{{${r[0]} \`<!--bookshop-live context(.: (${tidy(value)}))-->\`${r[1]} | safeHTML }}`
    } else if (liveMarkup && TOKENS.BOOKSHOP.test(raw)) {
        let [, name, params] = raw.match(TOKENS.BOOKSHOP);
        const r = required_wrapper_hugo_func(params);
        outputToken.text = `{{${r[0]} \`<!--bookshop-live name(${name}) params(.: (${tidy(params)}))-->\`${r[1]} | safeHTML }}${outputToken.text}{{ \`<!--bookshop-live end-->\` | safeHTML }}`
    } else if (liveMarkup && TOKENS.BOOKSHOP_SCOPED.test(raw)) {
        outputToken.text = [`{{ if reflect.IsSlice . }}{{ (printf \`<!--bookshop-live name(%s) params(.: .)-->\` (index . 0)) | safeHTML }}`,
            `{{- else if reflect.IsMap . -}}{{ (printf \`<!--bookshop-live name(%s) params(.: .)-->\` ._bookshop_name) | safeHTML }}{{ end }}`,
            `${outputToken.text}`,
            `{{ \`<!--bookshop-live end-->\` | safeHTML }}`
        ].join('');
    }

    return outputToken;
}

// limit comments to one line & escape backticks to something we undo later
const tidy = val => val.replace(/[\r\n]/g, ' ').replace(/`/g, 'BKSH_BACKTICK');

// The replace function we need to add to undo the backtick tidy above
const required_wrapper_hugo_func = val => /`/.test(val) ? [` replace`, ` "BKSH_BACKTICK" "\`"`] : [``, ``];

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
