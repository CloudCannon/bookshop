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

test("add live markup to withs", t => {
    const input = `{{ with .b }}<p>{{.}}</p>{{ end }}`;
    const expected = [`{{ with .b }}`,
        `{{ \`<!--bookshop-live stack-->\` | safeHTML }}`,
        `{{ \`<!--bookshop-live context(.: .b)-->\` | safeHTML }}`,
        `<p>{{.}}</p>`,
        `{{ \`<!--bookshop-live unstack-->\` | safeHTML }}`,
        `{{ end }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to loops", t => {
    const input = `{{ range .items }}<p>{{ . }}</p>{{ end }}`;
    const expected = [`{{ $bookshop__live__iterator := 0 }}`,
        `{{ range .items }}`,
        `{{ \`<!--bookshop-live stack-->\` | safeHTML }}`,
        `{{ (printf \`<!--bookshop-live context(.: (index (.items) %d))-->\` $bookshop__live__iterator) | safeHTML }}`,
        `{{ $bookshop__live__iterator = (add $bookshop__live__iterator 1) }}`,
        `<p>{{ . }}</p>`,
        `{{ \`<!--bookshop-live unstack-->\` | safeHTML }}`,
        `{{ end }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to complex end structures", t => {
    const input = `
{{ range .items }}

    {{with .text}}
    <p>{{ . }}</p>
    {{ end }}

    {{ if .subtitle }}
        <h2>{{ .subtitle }}</h2>
    {{ else }}
        {{ with .excerpt }}
        <p>{{ . }}</p>
        {{end}}
    {{ end }}

{{ end }}`;
    const expected = `
{{ $bookshop__live__iterator := 0 }}{{ range .items }}{{ \`<!--bookshop-live stack-->\` | safeHTML }}{{ (printf \`<!--bookshop-live context(.: (index (.items) %d))-->\` $bookshop__live__iterator) | safeHTML }}{{ $bookshop__live__iterator = (add $bookshop__live__iterator 1) }}

    {{with .text}}{{ \`<!--bookshop-live stack-->\` | safeHTML }}{{ \`<!--bookshop-live context(.: .text)-->\` | safeHTML }}
    <p>{{ . }}</p>
    {{ \`<!--bookshop-live unstack-->\` | safeHTML }}{{ end }}

    {{ if .subtitle }}
        <h2>{{ .subtitle }}</h2>
    {{ else }}
        {{ with .excerpt }}{{ \`<!--bookshop-live stack-->\` | safeHTML }}{{ \`<!--bookshop-live context(.: .excerpt)-->\` | safeHTML }}
        <p>{{ . }}</p>
        {{ \`<!--bookshop-live unstack-->\` | safeHTML }}{{end}}
    {{ end }}

{{ \`<!--bookshop-live unstack-->\` | safeHTML }}{{ end }}`;
    t.is(translateTextTemplate(input, {}), expected);
});