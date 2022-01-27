import test from 'ava';
import translateTextTemplate from './translateTextTemplate.js';

test("add live markup to bookshop tags", t => {
    const input = `{{ partial "bookshop" (slice "content" (dict "content_html" .Params.note_html "type" "note")) }}`;
    const expected = [
        `{{ \`<!--bookshop-live name(content) params(.: (dict "content_html" .Params.note_html "type" "note"))-->\` | safeHTML }}`,
        `{{ partial "bookshop" (slice "content" (dict "content_html" .Params.note_html "type" "note")) }}`,
        `{{ \`<!--bookshop-live end-->\` | safeHTML }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to bookshop_partial tags", t => {
    const input = `{{ partial "bookshop_partial" (slice "helper" (dict "text" "input")) }}`;
    const expected = [
        `{{ \`<!--bookshop-live name(helper) params(.: (dict "text" "input"))-->\` | safeHTML }}`,
        `{{ partial "bookshop_partial" (slice "helper" (dict "text" "input")) }}`,
        `{{ \`<!--bookshop-live end-->\` | safeHTML }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to assigns", t => {
    const input = `{{ $a := .b }}`;
    const expected = `{{ $a := .b }}{{ \`<!--bookshop-live context($a: .b)-->\` | safeHTML }}`;
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to loops", t => {
    const input = `{{ range .items }}<p>{{ . }}</p>{{ end }}`;
    const expected = [`{{ $bookshop__live__iterator := 0 }}`,
        `{{ range .items }}`,
        `{{ (printf \`<!--bookshop-live context(.: (index (.items) %d))-->\` $bookshop__live__iterator) | safeHTML }}`,
        `{{ $bookshop__live__iterator = (add $bookshop__live__iterator 1) }}`,
        `<p>{{ . }}</p>{{ end }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});