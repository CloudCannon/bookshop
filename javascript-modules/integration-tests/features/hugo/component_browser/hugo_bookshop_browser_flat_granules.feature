@hugo
Feature: Hugo Bookshop Component Browser Granular Steps

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
    * a component-lib/components/single.bookshop.toml file containing:
      """
      [spec]
      structures = [ "content_blocks" ]
      label = "Single"
      description = "Single component"
      icon = "nature_people"
      tags = ["Basic"]

      [blueprint]
      title = "Hello There, World"
      """
    * a component-lib/components/single.hugo.html file containing:
      """
      <h1>{{ .title }}</h1>
      """
    * a site/layouts/index.html file containing:
      """
      <html>
      <body>
      {{ partial "bookshop_component_browser" }}
      </body>
      </html>
      """
    * a site/content/_index.md file containing:
      """
      ---
      ---
      """

  @web
  Scenario: Bookshop component browser renders a flat component
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"
