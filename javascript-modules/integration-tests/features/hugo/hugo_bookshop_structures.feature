Feature: Hugo Bookshop CloudCannon Integration
  As a user of Hugo with Bookshop
  I want my CMS interfaces to be preconfigured
  So that I can build pages out of my components

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
  Scenario: Basic Array Structure