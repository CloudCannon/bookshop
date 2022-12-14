@hugo @web @bespoke
Feature: Hugo Bookshop CloudCannon Live Editing Edge Cases

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        go.mod from starters/hugo/components.go.mod
        config.toml from starters/hugo/components.config.toml
        bookshop/
          bookshop.config.js from starters/hugo/bookshop.config.js
      site/
        go.mod from starters/hugo/site.go.mod
        config.toml from starters/hugo/site.config.toml
      """

  Scenario: Hugo Bookshop live renders a complex component
    Given a component-lib/components/heading/heading.hugo.html file containing:
      """
      {{ $level := default 2 .level }}
      {{ $level = string
          $level }}
      {{ $level_classes := dict
          "1" "class-one"
          "2" "class-two"
          "3" "class-three"
          "4" "class-four"
      }}
      {{ $level_class := "lg" }}
      {{ with index $level_classes $level }}
          {{ $level_class = . }}
      {{ end }}
      {{ $open := printf `<h%s class="%s">` $level $level_class }}
      {{ $close := printf `</h%s>` $level }}
      {{ with .copy }}
          {{ safeHTML $open -}}
          {{ partial "bookshop" (slice "text" .) }}
          {{- safeHTML $close }}
      {{ end }}
      """
    Given a component-lib/components/text/text.hugo.html file containing:
      """
      <span>{{ markdownify . }}</span>
      """
    Given [front_matter]:
      """
      heading:
        copy: The delicious aroma from the kitchen was ruined by cigarette smoke.
        level: 5
      """
    And a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `.Params.heading` }}
      {{ partial "bookshop" (slice "heading" .Params.heading) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      heading:
        copy: New heading.
        level: 2
      """
    And  🌐 "window.bookshopLive?.renderCount === 2" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h2 should match '<h2 class="class-two" data-cms-bind="#heading"><!--bookshop-live name(text) params(.: (.))--><span data-cms-bind="#heading.copy">New heading.</span><!--bookshop-live end--></h2>'

  Scenario: Hugo Bookshop live renders a map iterator
    Given a component-lib/components/page/page.hugo.html file containing:
      """
      {{ range . }}
      {{ $dot := . }}
      <div>
        {{ partial "bookshop" . }}
        {{ range $key, $value := $dot }}
          <span>{{ $key }}: {{ . }}</span>
        {{ end }}
      </div>
      {{ end }}
      """
    Given a component-lib/components/text/text.hugo.html file containing:
      """
      <p>{{ markdownify .text }}</p>
      """
    Given [front_matter]:
      """
      components:
        - _bookshop_name: text
          text: Hello
      """
    And a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """
    And a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `.Params.components` }}
      {{ partial "bookshop" (slice "page" .Params.components) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: text
          text: Hello
        - _bookshop_name: text
          text: Hooray
      """
    And  🌐 "window.bookshopLive?.renderCount === 2" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector div:nth-of-type(1)>span:nth-of-type(1) should contain '_bookshop_name: text'
    *    🌐 The selector div:nth-of-type(1)>span:nth-of-type(2) should contain 'text: Hello'
    *    🌐 The selector div:nth-of-type(2)>span:nth-of-type(1) should contain '_bookshop_name: text'
    *    🌐 The selector div:nth-of-type(2)>span:nth-of-type(2) should contain 'text: Hooray'
