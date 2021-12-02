Feature: Hugo Bookshop Component Browser
  As a user of Hugo with Bookshop
  I want my component browser to be preconfigured to my bookshop
  So that I can view components while developing

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
    And a site/content/_index.md file containing:
      """
      ---
      ---
      """

  @skip # NYI
  Scenario: Bookshop Browser tags

  @skip # NYI
  Scenario: Bookshop extracted site data
