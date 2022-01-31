@hugo @web
Feature: Hugo Bookshop CloudCannon Live Editing Automatic Data Bindings

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
    * a component-lib/components/title/title.hugo.html file containing:
      """
      <h1>{{ .innards }}</h1>
      """

  Scenario: Bookshop live renders a simple data binding
    Given [front_matter]:
      """
      hero: "Hello World"
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
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero)) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#hero\">Hello World</h1>"

  Scenario: Bookshop live renders a nested data binding
    Given a component-lib/components/outer/outer.hugo.html file containing:
      """
      <div>{{ partial "bookshop" (slice "title" (dict "innards" .title.item)) }}</div>
      """
    And [front_matter]:
      """
      items:
        item: "Hello There"
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
      {{ partial "bookshop_bindings" `(dict "title" .Params.items)` }}
      {{ partial "bookshop" (slice "outer" (dict "title" .Params.items)) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"

  Scenario: Bookshop live renders a nested loop data binding
    Given a component-lib/components/loop/loop.hugo.html file containing:
      """
      <div>{{ range .rows }}{{ partial "bookshop" (slice "title" (dict "innards" .)) }}{{ end }}</div>
      """
    And [front_matter]:
      """
      rows:
        - "Hello There"
        - "Goodbye You"
        - "A third one."
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
      {{ partial "bookshop_bindings" `(dict "rows" .Params.rows)` }}
      {{ partial "bookshop" (slice "loop" (dict "rows" .Params.rows)) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#rows.0\">Hello There</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#rows.1\">Goodbye You</h1>"
    Then 🌐 The selector h1:nth-of-type(3) should match "<h1 data-cms-bind=\"#rows.2\">A third one.</h1>"

  Scenario: Bookshop live renders a data binding through an assign
    Given a component-lib/components/outer/outer.hugo.html file containing:
      """
      {{ $f := (dict "innards" .title.item) }}
      <div>{{ partial "bookshop" (slice "title" $f) }}</div>
      """
    And [front_matter]:
      """
      items:
        item: "Hello There"
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
      {{ partial "bookshop_bindings" `(dict "title" .Params.items)` }}
      {{ partial "bookshop" (slice "outer" (dict "title" .Params.items)) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1 data-cms-bind=\"#items.item\">Hello There</h1>"

  Scenario: Bookshop live renders a parent data binding over a child
    Given a component-lib/components/loop/loop.hugo.html file containing:
      """
      {{ range .rows }}{{ partial "bookshop" (slice "title" (dict "innards" .)) }}{{ end }}
      """
    And [front_matter]:
      """
      rows:
        - "Hello There"
        - "Goodbye You"
        - "A third one."
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
      {{ partial "bookshop_bindings" `(dict "rows" .Params.rows)` }}
      {{ partial "bookshop" (slice "loop" (dict "rows" .Params.rows)) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1 data-cms-bind=\"#rows\">Hello There</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1 data-cms-bind=\"#rows\">Goodbye You</h1>"
    Then 🌐 The selector h1:nth-of-type(3) should match "<h1 data-cms-bind=\"#rows\">A third one.</h1>"

  Scenario: Bookshop live respects the per-component dataBinding flag
    Given [front_matter]:
      """
      hero: "Hello World"
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
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero "dataBinding" false)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero "dataBinding" false)) }}
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero "_dataBinding" false)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero "_dataBinding" false)) }}
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero "data_binding" false)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero "data_binding" false)) }}
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero "_data_binding" false)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero "_data_binding" false)) }}
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero "editorLink" false)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero "editorLink" false)) }}
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero "_editorLink" false)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero "_editorLink" false)) }}
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero "editor_link" false)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero "editor_link" false)) }}
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero "_editor_link" false)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero "_editor_link" false)) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1:nth-of-type(1) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(2) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(3) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(4) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(5) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(6) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(7) should match "<h1>Hello World</h1>"
    Then 🌐 The selector h1:nth-of-type(8) should match "<h1>Hello World</h1>"

  Scenario: Bookshop live respects the global dataBindings flag
    Given [front_matter]:
      """
      hero: "Hello World"
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
      <script>window.bookshopDataBindings = false;</script>
      {{ partial "bookshop_bindings" `(dict "innards" .Params.hero)` }}
      {{ partial "bookshop" (slice "title" (dict "innards" .Params.hero)) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    Then 🌐 The selector h1 should match "<h1>Hello World</h1>"
