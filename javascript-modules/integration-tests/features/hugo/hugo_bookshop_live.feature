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
  Scenario: Bookshop Live tag
    Given a site/layouts/index.html file containing:
      """
      {{ partial "bookshop_live" "_cloudcannon/bookshop-live.js" }}
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain each row: 
      | text |
      | script.src = `/_cloudcannon/bookshop-live.js`; |

  @skip # NYI
  Scenario: Site data extracted for live editing

  @skip # NYI
  Scenario: Bookshop Live schema comments
    Given a component-lib/components/a/a.hugo.html file containing:
      """
      <p>a-{{ .text }}</p>
      """
    And a component-lib/components/b/b.hugo.html file containing:
      """
      <p>b-{{ .title }}</p>
      """
    And a site/content/_index.md file containing:
      """
      ---
      content_blocks:
        - _bookshop_name: a
          text: 'component-one'
        - _bookshop_name: b
          title: 'component-two'
      ---
      """
    And a site/layouts/index.html file containing:
      """
      {{ partial "bookshop" .Params.content_blocks }}
      """
    When I run "hugo" in the site directory
    Then stderr should be empty
    And stdout should contain "Total in"
    And site/public/index.html should contain each row: 
      | text |
      | <p>a-component-one</p> |
      | <p>b-component-two</p> |
      | <!--bookshop-live name(a) params(? ? ?) context() -->  |
      | <!--bookshop-live name(b) params(? ? ?) context() -->  |
