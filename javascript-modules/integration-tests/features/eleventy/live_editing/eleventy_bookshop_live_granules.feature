Feature: Eleventy Bookshop CloudCannon Live Editing Granular Steps

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        bookshop/
          bookshop.config.js from starters/eleventy/bookshop.config.js
      site/
        .eleventy.js from starters/eleventy/.eleventy.cloudcannon.js
        .eleventyignore from starters/eleventy/.eleventyignore
        package.json from starters/eleventy/package.json # <-- this .json line hurts my syntax highlighting
        _includes/
          layouts/
            default.liquid from starters/eleventy/default.liquid
        cloudcannon/
          info.11tydata.js from ../../node_modules/eleventy-plugin-cloudcannon/cloudcannon/info.11tydata.js
          info.njk from ../../node_modules/eleventy-plugin-cloudcannon/cloudcannon/info.njk
          inject-cloudcannon.config.js from ../../node_modules/eleventy-plugin-cloudcannon/cloudcannon/inject-cloudcannon.config.js
      """
    And a component-lib/components/single/single.bookshop.toml file containing:
      """
      [component]
      structures = [ "content_blocks" ]

      [props]
      title = "Hello World"
      """
    And a component-lib/components/single/single.eleventy.liquid file containing:
      """
      <h1>{{ title }}</h1>
      """
    And a site/index.html file containing:
      """
      ---
      layout: layouts/default.liquid
      block:
        title: "Hello There"
      ---
      {% bookshop "single" bind: block %}
      """

  Scenario: Bookshop adds live editing markup
    When I run "npm start" in the site directory
    Then stderr should be empty
    *    stdout should not be empty
    *    site/_site/index.html should contain each row: 
      | text |
      | <!--bookshop-live name(single) params(bind: block) context() -->  |

  Scenario: Bookshop Generate hydrates live editing
    Given I run "npm start" in the site directory
    When I run "npm start" in the . directory
    Then stderr should be empty
    *    stdout should contain "Modifying built site at ./site/_site"
    *    stdout should contain "Added live editing to 1 page containing Bookshop components"

  Scenario: Bookshop live renders when CloudCannon initialises
    Given I run "npm start" in the site directory
    *     I run "npm start" in the . directory
    *     I serve the site/_site directory
    *    🌐 I load http://localhost:__PORT__
    When 🌐 CloudCannon is ready with the data:
      """
      { block: { title: "Gidday" } } 
      """
    And  🌐 "window.bookshopLive.hasRendered === true" evaluates
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Gidday"

  Scenario: Bookshop live renders when CloudCannon pushes new data
    Given I run "npm start" in the site directory
    *     I run "npm start" in the . directory
    *     I serve the site/_site directory
    *    🌐 I load http://localhost:__PORT__
    *    🌐 CloudCannon is ready with the data:
      """
      { block: { title: "Hello There" } } 
      """
    *    🌐 "window.bookshopLive.hasRendered === true" evaluates
    When 🌐 CloudCannon pushes new data:
      """
      { block: { title: "Rerendered" } } 
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Rerendered"
