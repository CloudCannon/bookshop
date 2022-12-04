@hugo
Feature: Hugo Bookshop CloudCannon Live Editing Granular Steps

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
    * a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `(dict "title" .Params.block.title)` }}
      {{ partial "bookshop" (slice "single" (dict "title" .Params.block.title)) }}
      </body>
      </html>
      """
    * [front_matter]:
      """
      block:
        title: "Hello There"
      """
    * a site/content/_index.md file containing:
      """
      ---
      [front_matter]
      ---
      """

  Scenario: Bookshop adds live editing markup
    When I run "hugo" in the site directory
    Then stderr should be empty
    *    stdout should contain "Total in"
    *    site/public/index.html should contain each row:
      | text                                                                                            |
      | <!--bookshop-live name(__bookshop__subsequent) params(.: (dict "title" .Params.block.title))--> |
      | <!--bookshop-live name(single)-->                                                               |

  Scenario: Bookshop Generate hydrates live editing
    Given I run "hugo" in the site directory
    *     I run "cloudcannon-hugo --baseurl /" in the site directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should contain "Modifying output site at ./site/public"
    *    stdout should contain "Added live editing to 1 page containing Bookshop components"
    *    site/public/_cloudcannon/info.json should exist
    *    site/public/_cloudcannon/bookshop-live.js should contain the text "hugo_renderer.wasm-"

  @web
  Scenario: Bookshop live renders when CloudCannon initialises
    Given [front_matter]:
      """
      block:
        title: "Gidday"
      """
    When 🌐 I load my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Gidday"

  @web
  Scenario: Bookshop live renders when CloudCannon pushes new data
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "Rerendered"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Rerendered"

  @web
  Scenario: Bookshop doesn't live render flagged components
    Given a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_bindings" `(dict "title" .Params.block.title "_live_render" false)` }}
      {{ partial "bookshop" (slice "single" (dict "title" .Params.block.title "_live_render" false)) }}
      </body>
      </html>
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "Rerendered"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There"

  @web
  Scenario: Bookshop sets a flag when live editing
    Given a component-lib/components/single/single.hugo.html file containing:
      """
      {{ if site.Params.env_bookshop_live }}
        <h1>LIVE! {{ .title }}</h1>
      {{ else }}
        <h1>DEAD? {{ .title }}</h1>
      {{ end }}
      {{ partial "bookshop" (slice "nested" (dict "title" .title)) }}
      """
    Given a component-lib/components/nested/nested.hugo.html file containing:
      """
      {{ if site.Params.env_bookshop_live }}
        <h2>LIVE! {{ .title }}</h2>
      {{ else }}
        <h2>DEAD? {{ .title }}</h2>
      {{ end }}
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "🫑"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "LIVE! 🫑"
    *    🌐 The selector h2 should contain "LIVE! 🫑"
