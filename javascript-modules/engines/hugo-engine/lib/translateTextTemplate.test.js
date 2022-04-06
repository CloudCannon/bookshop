import test from 'ava';
import translateTextTemplate from './translateTextTemplate.js';

test("add live markup to bookshop tags", t => {
    const input = `{{ partial "bookshop" (slice "content" (dict "content_html" .Params.note_html "type" "note")) }}`;
    const expected = [
        `{{ \`<!--bookshop-live name(content) params(.: ((dict "content_html" .Params.note_html "type" "note")))-->\` | safeHTML }}`,
        `{{ partial "bookshop" (slice "content" (dict "content_html" .Params.note_html "type" "note")) }}`,
        `{{ \`<!--bookshop-live end-->\` | safeHTML }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to scoped bookshop tags", t => {
    const input = `{{ partial "bookshop" . }}`;
    const expected = [
        `{{ if reflect.IsSlice . }}{{ (printf \`<!--bookshop-live name(%s) params(.: .)-->\` (index . 0)) | safeHTML }}`,
        `{{- else if reflect.IsMap . -}}{{ (printf \`<!--bookshop-live name(%s) params(.: .)-->\` ._bookshop_name) | safeHTML }}{{ end }}`,
        `{{ partial "bookshop" . }}`,
        `{{ \`<!--bookshop-live end-->\` | safeHTML }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("don't add live markup to bookshop_partial tags", t => {
    const input = `{{ partial "bookshop_partial" (slice "helper" (dict "text" "input")) }}`;
    const expected = `{{ partial "bookshop_partial" (slice "helper" (dict "text" "input")) }}`;
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to assigns", t => {
    let input = `{{ $a := .b }}`;
    let expected = `{{ $a := .b }}{{ \`<!--bookshop-live context($a: (.b))-->\` | safeHTML }}`;
    t.is(translateTextTemplate(input, {}), expected);

    input = `{{ $a := .b | chomp }}`;
    expected = `{{ $a := .b | chomp }}{{ \`<!--bookshop-live context($a: (.b | chomp))-->\` | safeHTML }}`;
    t.is(translateTextTemplate(input, {}), expected);

    input = `{{ $a = .b }}`;
    expected = `{{ $a = .b }}{{ \`<!--bookshop-live reassign($a: (.b))-->\` | safeHTML }}`;
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to withs", t => {
    const input = `{{ with .b }}<p>{{.}}</p>{{ end }}`;
    const expected = [`{{ with .b }}`,
        `{{ \`<!--bookshop-live stack-->\` | safeHTML }}`,
        `{{ \`<!--bookshop-live context(.: (.b))-->\` | safeHTML }}`,
        `<p>{{.}}</p>`,
        `{{ \`<!--bookshop-live unstack-->\` | safeHTML }}`,
        `{{ end }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to loops", t => {
    const input = `{{ range .items }}<p>{{ . }}</p>{{ end }}`;
    const expected = [`{{ $bookshop__live__iterator__keys := (slice) }}`,
        `{{ range $i, $e := (.items) }}{{ $bookshop__live__iterator__keys = $bookshop__live__iterator__keys | append $i }}{{ end }}`,
        `{{ $bookshop__live__iterator := 0 }}`,
        `{{ range .items }}`,
        `{{ \`<!--bookshop-live stack-->\` | safeHTML }}`,
        `{{ $bookshop__live__iterator__key := (index ($bookshop__live__iterator__keys) $bookshop__live__iterator) }}`,
        `{{ (printf \`<!--bookshop-live context(.: (index (.items) %v))-->\` (jsonify $bookshop__live__iterator__key)) | safeHTML }}`,
        `{{ $bookshop__live__iterator = (add $bookshop__live__iterator 1) }}`,
        `<p>{{ . }}</p>`,
        `{{ \`<!--bookshop-live unstack-->\` | safeHTML }}`,
        `{{ end }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to loops with iterators", t => {
    const input = `{{range $loop_index, $element := .columns}}<p>{{$element}}</p>{{ end }}`;
    const expected = [`{{range $loop_index, $element := .columns}}`,
        `{{ \`<!--bookshop-live stack-->\` | safeHTML }}`,
        `{{ (printf \`<!--bookshop-live context(.: (index (.columns) %v))-->\` (jsonify $loop_index)) | safeHTML }}`,
        `<p>{{$element}}</p>`,
        `{{ \`<!--bookshop-live unstack-->\` | safeHTML }}`,
        `{{ end }}`
    ].join('');
    t.is(translateTextTemplate(input, {}), expected);
});

test("escape backticks in values", t => {
    let input = `{{ $a := "hi\`:)" }}`;
    let expected = `{{ $a := "hi\`:)" }}{{ replace \`<!--bookshop-live context($a: ("hiBKSH_BACKTICK:)"))-->\` "BKSH_BACKTICK" "\`" | safeHTML }}`;
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
{{ $bookshop__live__iterator__keys := (slice) }}{{ range $i, $e := (.items) }}{{ $bookshop__live__iterator__keys = $bookshop__live__iterator__keys | append $i }}{{ end }}{{ $bookshop__live__iterator := 0 }}{{ range .items }}{{ \`<!--bookshop-live stack-->\` | safeHTML }}{{ $bookshop__live__iterator__key := (index ($bookshop__live__iterator__keys) $bookshop__live__iterator) }}{{ (printf \`<!--bookshop-live context(.: (index (.items) %v))-->\` (jsonify $bookshop__live__iterator__key)) | safeHTML }}{{ $bookshop__live__iterator = (add $bookshop__live__iterator 1) }}

    {{with .text}}{{ \`<!--bookshop-live stack-->\` | safeHTML }}{{ \`<!--bookshop-live context(.: (.text))-->\` | safeHTML }}
    <p>{{ . }}</p>
    {{ \`<!--bookshop-live unstack-->\` | safeHTML }}{{ end }}

    {{ if .subtitle }}
        <h2>{{ .subtitle }}</h2>
    {{ else }}
        {{ with .excerpt }}{{ \`<!--bookshop-live stack-->\` | safeHTML }}{{ \`<!--bookshop-live context(.: (.excerpt))-->\` | safeHTML }}
        <p>{{ . }}</p>
        {{ \`<!--bookshop-live unstack-->\` | safeHTML }}{{end}}
    {{ end }}

{{ \`<!--bookshop-live unstack-->\` | safeHTML }}{{ end }}`;
    t.is(translateTextTemplate(input, {}), expected);
});

test("add live markup to complex components", t => {
    const input = `
{{ $level := default 2 .level }}
{{ $level = string
    $level }}
{{ $level_classes := dict 
    "1" "border-b py-8 text-4xl"
    "2" "border-b py-6 text-3xl"
    "3" "border-b py-4 text-2xl font-bold"
    "4" "border-b text-xl font-bold"
}}
{{ $level_class := "lg" }}
{{ with index $level_classes $level }}
    {{ $level_class = . }}
{{ end }}
{{ $open := printf \`<h%s class="%s">\` $level $level_class }}
{{ $close := printf \`</h%s>\` $level }}
{{ with .copy }}
    {{ safeHTML $open }}
    {{ markdownify . }} | bookshop
    {{ safeHTML $close }}
{{ end }}`;
    const expected = `
{{ $level := default 2 .level }}{{ \`<!--bookshop-live context($level: (default 2 .level))-->\` | safeHTML }}
{{ $level = string
    $level }}{{ \`<!--bookshop-live reassign($level: (string     $level))-->\` | safeHTML }}
{{ $level_classes := dict 
    "1" "border-b py-8 text-4xl"
    "2" "border-b py-6 text-3xl"
    "3" "border-b py-4 text-2xl font-bold"
    "4" "border-b text-xl font-bold"
}}{{ \`<!--bookshop-live context($level_classes: (dict      "1" "border-b py-8 text-4xl"     "2" "border-b py-6 text-3xl"     "3" "border-b py-4 text-2xl font-bold"     "4" "border-b text-xl font-bold"))-->\` | safeHTML }}
{{ $level_class := "lg" }}{{ \`<!--bookshop-live context($level_class: ("lg"))-->\` | safeHTML }}
{{ with index $level_classes $level }}{{ \`<!--bookshop-live stack-->\` | safeHTML }}{{ \`<!--bookshop-live context(.: (index $level_classes $level))-->\` | safeHTML }}
    {{ $level_class = . }}{{ \`<!--bookshop-live reassign($level_class: (.))-->\` | safeHTML }}
{{ \`<!--bookshop-live unstack-->\` | safeHTML }}{{ end }}
{{ $open := printf \`<h%s class="%s">\` $level $level_class }}{{ replace \`<!--bookshop-live context($open: (printf BKSH_BACKTICK<h%s class="%s">BKSH_BACKTICK $level $level_class))-->\` "BKSH_BACKTICK" "\`" | safeHTML }}
{{ $close := printf \`</h%s>\` $level }}{{ replace \`<!--bookshop-live context($close: (printf BKSH_BACKTICK</h%s>BKSH_BACKTICK $level))-->\` "BKSH_BACKTICK" "\`" | safeHTML }}
{{ with .copy }}{{ \`<!--bookshop-live stack-->\` | safeHTML }}{{ \`<!--bookshop-live context(.: (.copy))-->\` | safeHTML }}
    {{ safeHTML $open }}
    {{ markdownify . }} | bookshop
    {{ safeHTML $close }}
{{ \`<!--bookshop-live unstack-->\` | safeHTML }}{{ end }}`;
    t.is(translateTextTemplate(input, {}), expected);
});