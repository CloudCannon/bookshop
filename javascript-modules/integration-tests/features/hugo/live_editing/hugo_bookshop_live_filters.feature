@hugo @web
Feature: Hugo Bookshop CloudCannon Live Editing Filters and Functions

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

  Scenario: Bookshop live renders markdown
    Given a component-lib/components/beetroot/beetroot.hugo.html file containing:
      """
      <div><code>{{ .md | markdownify }}</code></div>
      """
    Given [front_matter]:
      """
      md: title
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
      {{ partial "bookshop_bindings" `(dict "md" .Params.md )` }}
      {{ partial "bookshop" (slice "beetroot" (dict "md" .Params.md )) }}
      </body>
      </html>
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      md: "**bold** title"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector code should match "<p><strong>bold</strong> title</p>"
  