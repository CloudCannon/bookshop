@eleventy0 @web
Feature: Eleventy Bookshop CloudCannon Live Editing

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
        package.json from starters/eleventy/eleventy-zero-package.json # <-- this .json line hurts my syntax highlighting
        _includes/
          layouts/
            default.liquid from starters/eleventy/default.liquid
      """

  Scenario: Bookshop Live browser update
    Given a component-lib/components/single/single.bookshop.toml file containing:
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
      content_blocks:
        - _bookshop_name: single
          title: "Hello There"
      ---
      {% for block in content_blocks %}
        {% bookshop {{block._bookshop_name}} bind: block %}
      {% endfor %}
      """
    # Building the site
    When I run "npm start" in the site directory
    Then stderr should be empty
    Then stdout should not be empty
    Then site/_site/index.html should contain each row: 
      | text |
      | <!--bookshop-live name(single) params(bind: block) context(block: content_blocks[0]) -->  |
    # Running Bookshop Generate
    When I run "npm start" in the . directory
    Then stderr should be empty
    Then stdout should contain "Modifying built site at ./site/_site"
    Then stdout should contain "Added live editing to 1 page containing Bookshop components"
    # Testing CloudCannon initialising
    When I serve the site/_site directory
    When 🌐 I load http://localhost:__PORT__
    Then 🌐 The selector h1 should contain "Hello There"
    When 🌐 CloudCannon is ready with the data:
      """
      {
        content_blocks: [ {
          _bookshop_name: "single",
          title: "Gidday"
        } ]
      }
      """
       * 🌐 "window.bookshopLive?.renderCount > 0" evaluates
    Then 🌐 The selector h1 should contain "Gidday"
    # Testing CloudCannon data changing
    When 🌐 CloudCannon pushes new json:
      """
      {
        content_blocks: [ {
          _bookshop_name: "single",
          title: "Rerendered"
        } ]
      }
      """
    Then 🌐 There should be no errors
    Then 🌐 The selector h1 should contain "Rerendered"