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
    * a component-lib/components/single/single.bookshop.toml file containing:
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
    * a component-lib/components/single/single.hugo.html file containing:
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

  Scenario: Bookshop adds component browser markup
    When I run "hugo" in the site directory
    Then stderr should be empty
    *    stdout should contain "Total in"
    *    site/public/index.html should contain each row: 
      | text |
      | <div data-bookshop-browser=""></div> |
      | <script src="http://localhost:30775/bookshop.js"></script> |

  Scenario: Bookshop Generate hydrates component browser
    Given I run "hugo" in the site directory
    *     I run "cloudcannon-hugo --baseurl /" in the site directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should contain "Modifying output site at ./site/public"
    *    stdout should contain "Built component browser into 1 page"
    *    site/public/index.html should contain each row: 
      | text |
      | <script src="/_bookshop/bookshop-browser.min.js?cb=  |

  @web
  Scenario: Bookshop component browser initialises
    When 🌐 I load my site
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector .tutorial should contain "Select a component using the"

  @web
  Scenario: Bookshop component browser renders a component
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"
