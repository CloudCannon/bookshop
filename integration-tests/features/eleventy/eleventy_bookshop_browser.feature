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
      {% bookshop_browser :8465 %}
      {% bookshop_browser 99 %}
      {% bookshop_browser localhost:1414 %}
      {% bookshop_browser example.com/bookshop.js %}
      {% bookshop_browser https://example.com/bookshop.js %}
      {% bookshop_browser /_folder/bookshop-browser.js %}
      """
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And site/_site/components/index.html should contain each row: 
      | text |
      | <div data-bookshop-browser></div>                             |
      | <script src=\"http://localhost:8465/bookshop.js\"></script>   |
      | <script src=\"http://localhost:99/bookshop.js\"></script>     |
      | <script src=\"http://localhost:1414/bookshop.js\"></script>   |
      | <script src=\"//example.com/bookshop.js\"></script>           |
      | <script src=\"https://example.com/bookshop.js\"></script>     |
      | <script src=\"/_folder/bookshop-browser.js\"></script>        |

  @skip # TODO: Eleventy does not yet support pulling data into bookshop
  Scenario: Eleventy Bookshop extracted site data
    Given a site/components.html file containing:
      """
      ---
      ---
      {% bookshop_browser :8465 %}
      """
    And a site/_data/test.yml file containing "title: Zuchinni"
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And site/_site/components/index.html should contain the text "Zuchinni"
