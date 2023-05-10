@hugo @web
Feature: Hugo Bookshop CloudCannon Live Editing Error Boundaries

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
    * a component-lib/components/page/page.hugo.html file containing:
      """
      <div class="page">
      {{ range .content_blocks }}
        {{ partial "bookshop" . }}
      {{ end }}
      </div>
      """
    * a component-lib/components/good/good.hugo.html file containing:
      """
      <h1>{{ .text }}</h1>
      """
    * a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `(dict "content_blocks" .Params.components)` }}
      {{ partial "bookshop" (slice "page" (dict "content_blocks" .Params.components)) }}
      </body>
      </html>
      """
    * [front_matter]:
      """
      components:
        - _bookshop_name: good
          text: Hello World 01
      """
    * a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """

  Scenario: Bookshop wraps component errors in an error boundary
    Given a component-lib/components/bad/bad.hugo.html file containing:
      """
      <h1>{{ div 4 0 }}</h1>
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: good
          text: Hello World 01
        - _bookshop_name: bad
        - _bookshop_name: good
          text: Hello World 02
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector body>div should contain "Failed to render"
    *    🌐 The selector body>div should contain "can't divide the value by 0"
    *    🌐 The selector h1:nth-of-type(1) should contain "Hello World 01"
    *    🌐 The selector h1:nth-of-type(2) should contain "Hello World 02"

  Scenario: Bookshop replaces non-existent components in an error boundary
    # Note: No `bad.hugo.html` component has been created.
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: good
          text: Hello World 01
        - _bookshop_name: bad
        - _bookshop_name: good
          text: Hello World 02
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector body>div should contain "Failed to find"
    *    🌐 The selector h1:nth-of-type(2) should contain "Hello World 02"

  # These errors present differently in the Hugo logs so are tested independently
  @bespoke
  Scenario: Bookshop replaces Hugo non-existent partials in an error boundary
    Given a component-lib/components/bad/bad.hugo.html file containing:
      """
      <h1>{{ partial "nuffin" }}</h1>
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      components:
        - _bookshop_name: good
          text: Hello World 01
        - _bookshop_name: bad
        - _bookshop_name: good
          text: Hello World 02
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector body>div should contain "Failed to render"
    *    🌐 The selector body>div should contain "partial \"nuffin\" not found"
    *    🌐 The selector h1:nth-of-type(2) should contain "Hello World 02"