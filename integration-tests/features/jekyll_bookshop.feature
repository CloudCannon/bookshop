Feature: Basic Jekyll Bookshop
  As a user of Jekyll with Bookshop
  I want to be able to use components
  So that I can build my site

  Background:
    Given the file tree:
      """
      bookshop/
        bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        _config.yml from starters/jekyll/_config.yml
        Gemfile from starters/jekyll/Gemfile
      """
    And a site/index.html file containing:
      """
      ---
      ---
      <h1>Hello World!</h1>
      """

  Scenario: Tests are functional
    When I run "bundle install && bundle exec jekyll build" in the site directory
    Then stdout should contain "Bookshop site data generated"
    And site/_site/index.html should exist
    And site/_site/index.html should contain the text "Hello World"
