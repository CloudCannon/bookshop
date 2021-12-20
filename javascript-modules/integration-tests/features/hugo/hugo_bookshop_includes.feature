Feature: Hugo Bookshop Includes
  As a user of Hugo with Bookshop
  I want includes scoped to the bookshop
  So that I can use them on the site or in components

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

  Scenario: Basic Bookshop Include
    Given a component-lib/shared/hugo/basic.hugo.html file containing:
      """
      {{.label}}🎉
      """
    And a component-lib/components/block/block.hugo.html file containing:
      """
      <div>{{ partial "bookshop" (dict "partial" "basic" "label" .title) }}-Block</div>
      """
    And a site/layouts/index.html file containing:
      """
      {{ partial "bookshop" (dict "component" "block" "title" "Component") }}
      <span>{{ partial "bookshop" (dict "partial" "basic" "label" "Site") }}-Inline</span>
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should leniently contain each row:
      | text |
      | Component🎉 <!--bookshop-live end--> -Block |
      | Site🎉 <!--bookshop-live end--> -Inline |