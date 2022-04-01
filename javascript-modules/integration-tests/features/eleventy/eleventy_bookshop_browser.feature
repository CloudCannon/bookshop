@eleventy
Feature: Eleventy Bookshop Component Browser
  As a user of Eleventy with Bookshop
  I want my component browser to be preconfigured to my bookshop
  So that I can view components while developing

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/eleventy/bookshop.config.js
      site/
        .eleventy.js from starters/eleventy/.eleventy.js
        .eleventyignore from starters/eleventy/.eleventyignore
        package.json from starters/eleventy/package.json # <-- this .json line hurts my syntax highlighting
      """

  Scenario: Bookshop Browser tags
    Given a site/components.html file containing:
      """
      ---
      ---
      {% bookshop_component_browser %}
      {% bookshop_component_browser 99 %}
      """
    When I run "npm start" in the site directory
    Then stderr should be empty
    And site/_site/components/index.html should contain each row: 
      | text |
      | <div data-bookshop-browser=""></div>                             |
      | <script src=\"http://localhost:30775/bookshop.js\"></script>   |
      | <script src=\"http://localhost:99/bookshop.js\"></script>     |

