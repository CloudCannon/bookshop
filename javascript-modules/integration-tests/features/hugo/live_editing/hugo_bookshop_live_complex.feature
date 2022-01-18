@hugo
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

  Scenario: Bookshop live renders through an assign
    Given a component-lib/components/assigner/assigner.hugo.html file containing:
      """
      {{ $test_var := .contents._bookshop_name }}
      <div> {{ partial "bookshop" (dict "component" $test_var "title" .contents.title) }} </div>
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
      {{ partial "bookshop_bindings" "bind: .Params" }}
      {{ partial "bookshop" (dict "component" "assigner" "contents" .Params.contents ) }}
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
      {{ partial "bookshop_bindings" (printf "title: .Params.titles.%d" $index) }}
      {{ partial "bookshop" (dict "component" "single" "title" $element ) }}
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
      {{ partial "bookshop" (dict "component" "single" "title" . ) }}
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
      {{ partial "bookshop_bindings" "max: .Params.max" }}
      {{ partial "bookshop" (dict "component" "range" "max" .Params.max ) }}
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
        {{ partial "bookshop" (merge . (dict "component" ._bookshop_name)) }}
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
      {{ partial "bookshop_bindings" "content_blocks: .Params.components" }}
      {{ partial "bookshop" (dict "component" "page" "content_blocks" .Params.components) }}
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