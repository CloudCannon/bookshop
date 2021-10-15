Feature: Basic Hugo Bookshop
  As a user of Hugo with Bookshop
  I want to be able to use components
  So that I can build my site

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
      """

  Scenario: Tests are functional
    Given a site/layouts/index.html file containing:
      """
      {{ .Content }}
      """
    And a site/content/_index.md file containing:
      """
      ---
      ---
      # Hello World!
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text "Hello World!</h1>"

