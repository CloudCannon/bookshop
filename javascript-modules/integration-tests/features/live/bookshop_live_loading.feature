Feature: Bookshop CloudCannon Live Editing Loading

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
    * [ssg]: "hugo"

  @web
  Scenario: Bookshop live sets the CloudCannon loading state
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "Rendered!"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 "window.CloudCannon?.loadingMessages[0] === 'Loading Bookshop Live Editing'" should evaluate
    *    🌐 "window.CloudCannon?.loadingMessages[1] === false" should evaluate
    *    🌐 The selector h1 should contain "Rendered!"
