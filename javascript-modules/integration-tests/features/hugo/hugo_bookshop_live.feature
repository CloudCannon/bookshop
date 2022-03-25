@hugo
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

  Scenario: Bookshop Live schema comments
    Given a component-lib/components/page/page.hugo.html file containing:
      """
      {{ range .content_blocks }}
      <p>{{ ._bookshop_name }}</p>
      {{ partial "bookshop" (slice "single" (dict "_bookshop_name" "inner")) }}
      {{ end }}
      """
    Given a component-lib/components/single/single.hugo.html file containing:
      """
      <span>{{ ._bookshop_name }}</span>
      """
    And a site/content/_index.md file containing:
      """
      ---
      content_blocks:
        - _bookshop_name: fake
      ---
      """
    And a site/layouts/index.html file containing:
      """
      {{ partial "bookshop_bindings" `.Params` }}
      {{ partial "bookshop" (slice "page" .Params) }}
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain the text: 
      """
      <!--bookshop-live meta(version: "[version]")-->
      <!--bookshop-live name(__bookshop__subsequent) params(.: .Params)-->
      <!--bookshop-live name(page)-->
      
      <p>fake</p>
      <!--bookshop-live name(single)-->
      <span>inner</span>
      <!--bookshop-live end-->

      <!--bookshop-live end-->
      """
