@astro
Feature: Astro Bookshop Component Browser Granular Steps

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      cloudcannon.config.yml from starters/astro/cloudcannon.config.yml
      site/
        package.json from starters/astro/package.json # <-- this .json line hurts my syntax highlighting
        astro.config.mjs from starters/astro/astro.config.mjs
        src/
          bookshop/
            bookshop.config.cjs from starters/astro/bookshop.config.cjs
      """
    * a site/src/components/single/single.bookshop.toml file containing:
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
    * a site/src/components/single/single.astro file containing:
      """
      <h1>{ Astro.props.title }</h1>
      """
    * a site/src/pages/index.md file containing:
      """
      ---
      layout: ../layouts/Page.astro
      ---
      """
    * a site/src/layouts/Page.astro file containing:
      """
      ---
      import BookshopBrowser from '@bookshop/astro-bookshop/browser'
      ---

      <html lang="en"> <body>
      <BookshopBrowser />
      </body> </html>
      """

  Scenario: Bookshop adds component browser markup
    When I run "npm run build" in the site directory
    Then stderr should be empty
    *    stdout should not be empty
    *    site/dist/index.html should contain each row:
      | text                                                       |
      | <div data-bookshop-browser=""></div>                       |
      | <script src="http://localhost:30775/bookshop.js"></script> |

  Scenario: Bookshop Generate hydrates component browser
    Given I run "npm run build" in the site directory
    *     I run "cloudcannon-reader --output dist" in the site directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should contain "Modifying output site at ./site/dist"
    *    stdout should contain "Built component browser into 1 page"
    *    site/dist/index.html should contain each row:
      | text                                                |
      | <script src="/_bookshop/bookshop-browser.min.js?cb= |

  @web
  Scenario: Bookshop component browser initialises
    When 🌐 I load my site
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    Then 🌐 There should be no errors
    # React always yells at you to install dev tools, so there's always some logs
    # *    🌐 There should be no logs
    *    🌐 The selector .tutorial should contain "Select a component using the"

  @web
  Scenario: Bookshop component browser renders a component
    When 🌐 I load my site
    And 🌐 "typeof window.BookshopBrowser !== 'undefined'" evaluates
    And 🌐 "window.bookshopBrowser?.hasRendered === true" evaluates
    And 🌐 I trigger a mousedown on li:nth-of-type(2)>button
    And 🌐 "window.bookshopComponentHasRendered === true" evaluates
    Then 🌐 There should be no errors
    # React always yells at you to install dev tools, so there's always some logs
    # *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There, World"
