@hugo
Feature: Hugo Bookshop CloudCannon Live Editing Granular Steps

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
      {{ partial "bookshop_bind_next" ".Params.block" }}
      {{ partial "bookshop" (dict "component" "single" "title" .Params.block.title) }}
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

  Scenario: Bookshop adds live editing markup
    When I run "hugo" in the site directory
    Then stderr should be empty
    *    stdout should contain "Total in"
    *    site/public/index.html should contain each row: 
      | text |
      | <!--bookshop-live name(__bookshop__subsequent) params(bind: .Params.block) context() -->  |
      | <!--bookshop-live name(single) params() context() -->  |

  Scenario: Bookshop Generate hydrates live editing
    Given I run "hugo" in the site directory
    *     I run "cloudcannon-hugo --baseurl /" in the site directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should contain "Modifying built site at ./site/public"
    *    stdout should contain "Added live editing to 1 page containing Bookshop components"

  Scenario: Bookshop live renders when CloudCannon initialises
    Given [front_matter]:
      """
      block:
        title: "Gidday"
      """
    When 🌐 I load my site in CloudCannon
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Gidday"

  Scenario: Bookshop live renders when CloudCannon pushes new data
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "Rerendered"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Rerendered"
