@jekyll
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
      {% bookshop_component_browser %}
      {% bookshop_component_browser 99 %}
      """
    When I run "bundle exec jekyll build --trace --unpublished" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/components.html should contain each row: 
      | text |
      | <div data-bookshop-browser=""></div>                             |
      | <script src=\"http://localhost:30775/bookshop.js\"></script>   |
      | <script src=\"http://localhost:99/bookshop.js\"></script>     |
