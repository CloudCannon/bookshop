@generate
Feature: Bookshop Prefetch Generation
  As a user who is using a bookshop
  I want my CMS to prefetch large dependencies
  So that my visual editor loads more promptly

  Background:
    Given the file tree:
      """
      component-lib/
        go.mod from starters/hugo/components.go.mod
        config.toml from starters/hugo/components.config.toml
        bookshop/
          bookshop.config.js from starters/hugo/bookshop.config.js
      site/
        go.mod from starters/hugo/site.go.mod
        config.toml from starters/hugo/site.config.toml
      package.json from starters/generate/package.json  # <-- this .json line hurts my syntax highlighting
      """
    And a site/layouts/index.html file containing:
      """
      <html>
      <body>
      Bookshop tag to force live editing
      {{ partial "bookshop_bindings" `...` }}
      </body>
      </html>
      """
    And a site/content/_index.md file containing:
      """
      ---
      ---
      """
    When I run "hugo" in the site directory
    And I run "cloudcannon-hugo --baseurl /" in the site directory

  Scenario: Generating info.json includes prefetchFiles
    Given a component-lib/components/nested/card/card.bookshop.yml file containing:
      """
      spec:
        structures:
          - blocks

      blueprint:
        color: "#034AD8"
      """
    When I run "npm start" in the . directory
    Then stderr should be empty
    And stdout should contain "Added 1 structure from 1 Bookshop to 1 site."
    Then site/public/_cloudcannon/info.json should contain the text "/_cloudcannon/hugo_renderer.wasm-"
