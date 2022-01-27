@hugo @web
Feature: Hugo Bookshop CloudCannon Live Editing Selective Re-rendering

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
    * a component-lib/components/single/single.hugo.html file containing:
      """
      <h1>{{ .title }}</h1>
      """
    * a component-lib/components/tag/tag.hugo.html file containing:
      """
      <span>{{ .inner.text }}</span>
      """
    * a component-lib/shared/hugo/span.hugo.html file containing:
      """
      <span>{{ .text }}</span>
      """

  Scenario: Bookshop live renders a subcomponent
    Given a component-lib/components/outer/outer.hugo.html file containing:
      """
      <div> {{ partial "bookshop" (slice "single" (dict "title" .contents.title)) }} </div>
      """
    Given [front_matter]:
      """
      contents:
        title: My title
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
      {{ partial "bookshop_bindings" `(dict "contents" .Params.contents )` }}
      {{ partial "bookshop" (slice "outer" (dict "contents" .Params.contents )) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        title: Your title
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Your title"
  
  Scenario: Bookshop live renders a subinclude
    Given a component-lib/components/outer/outer.hugo.html file containing:
      """
      <div> {{ partial "bookshop_partial" (slice "span" (dict "text" .contents.title)) }} </div>
      """
    Given [front_matter]:
      """
      contents:
        title: My title
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
      {{ partial "bookshop_bindings" `.Params` }}
      {{ partial "bookshop" (slice "outer" (dict "contents" .Params.contents )) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        title: The title
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector span should contain "The title"

  Scenario: Bookshop live renders through an assign
    Given a component-lib/components/assigner/assigner.hugo.html file containing:
      """
      {{ $test_var := .contents._bookshop_name }}
      <div> {{ partial "bookshop" (slice $test_var (dict "title" .contents.title)) }} </div>
      """
    Given [front_matter]:
      """
      contents:
        _bookshop_name: single
        title: My title
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
      {{ partial "bookshop_bindings" `(dict "contents" .Params.contents )` }}
      {{ partial "bookshop" (slice "assigner" (dict "contents" .Params.contents )) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      contents:
        _bookshop_name: single
        title: Live Love Laugh
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Live Love Laugh"

  Scenario: Bookshop live renders a top level loop
    Given [front_matter]:
      """
      titles:
        - "First"
        - "Second"
        - "Third"
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
      {{ range $index, $element := .Params.titles }}
      {{ partial "bookshop_bindings" (printf "(dict \\"title\\" (index .Params.titles %d) )" $index) }}
      {{ partial "bookshop" (slice "single" (dict "title" $element )) }}
      {{ end }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      titles:
        - "First"
        - "New!"
        - "Third"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(2) should contain "New!"

  Scenario: Bookshop live renders a range loop
    Given a component-lib/components/range/range.hugo.html file containing:
      """
      <div>
      {{ range seq .max }}
      {{ partial "bookshop" (slice "single" (dict "title" . )) }}
      {{ end }}
      </div>
      """
    Given [front_matter]:
      """
      max: 1
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
      {{ partial "bookshop_bindings" `(dict "max" .Params.max )` }}
      {{ partial "bookshop" (slice "range" (dict "max" .Params.max )) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      max: 5
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1:nth-of-type(5) should contain "5"

  Scenario: Bookshop live renders a dynamic loop
    Given a component-lib/components/page/page.hugo.html file containing:
      """
      <div class="page">
      {{ range .content_blocks }}
        {{ partial "bookshop" . }}
      {{ end }}
      </div>
      """
    Given [front_matter]:
      """
      components:
        - _bookshop_name: single
          title: Block One
        - _bookshop_name: tag
          inner:
            text: Block Two
        - _bookshop_name: single
          title: Block Three
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
      {{ partial "bookshop_bindings" `(dict "content_blocks" .Params.components)` }}
      {{ partial "bookshop" (slice "page" (dict "content_blocks" .Params.components)) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: single
          title: Block One
        - _bookshop_name: tag
          inner:
            text: New Tag
        - _bookshop_name: single
          title: Block Three
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector span should contain "New Tag"
    *    🌐 The selector .page>*:nth-child(3) should contain "Block Three"