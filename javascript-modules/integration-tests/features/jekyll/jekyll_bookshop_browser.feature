Feature: Jekyll Bookshop Component Browser
  As a user of Jekyll with Bookshop
  I want my component browser to be preconfigured to my bookshop
  So that I can view components while developing

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        _config.yml from starters/jekyll/_config.yml
        Gemfile from starters/jekyll/Gemfile
        Gemfile.lock from starters/jekyll/Gemfile.lock
      """

  Scenario: Bookshop Browser tags
    Given a site/components.html file containing:
      """
      ---
      published: false
      ---
      {% bookshop_browser :8465 %}
      {% bookshop_browser 99 %}
      {% bookshop_browser localhost:1414 %}
      {% bookshop_browser example.com/bookshop.js %}
      {% bookshop_browser https://example.com/bookshop.js %}
      {% bookshop_browser /_folder/bookshop-browser.js %}
      """
    When I run "bundle exec jekyll build --unpublished" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/components.html should contain each row: 
      | text |
      | <div data-bookshop-browser></div>                             |
      | <script src=\"http://localhost:8465/bookshop.js\"></script>   |
      | <script src=\"http://localhost:99/bookshop.js\"></script>     |
      | <script src=\"http://localhost:1414/bookshop.js\"></script>   |
      | <script src=\"//example.com/bookshop.js\"></script>           |
      | <script src=\"https://example.com/bookshop.js\"></script>     |
      | <script src=\"/_folder/bookshop-browser.js\"></script>        |

  Scenario: Bookshop extracted site data
    Given a site/components.html file containing:
      """
      ---
      ---
      {% bookshop_browser :8465 %}
      """
    And a site/_data/test.yml file containing "title: Zuchinni"
    When I run "bundle exec jekyll build" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/components.html should contain the text "Zuchinni"
