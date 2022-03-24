@eleventy
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
      """
    * a component-lib/components/single/single.eleventy.liquid file containing:
      """
      <h1>{{ title }}</h1>
      """
    * [front_matter]:
      """
      layout: layouts/default.liquid
      block:
        title: "Hello There"
      """
    * a site/index.html file containing:
      """
      ---
      [front_matter]
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
    *    stdout should contain "Modifying output site at ./site/_site"
    *    stdout should contain "Added live editing to 1 page containing Bookshop components"

  @web
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

  @web
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

  @web
  Scenario: Bookshop doesn't live render flagged components
    Given a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop "single" live_render: false bind: block %}
      """
    Given 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      block:
        title: "Rerendered"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector h1 should contain "Hello There"
