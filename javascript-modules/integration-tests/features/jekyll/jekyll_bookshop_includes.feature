Feature: Jekyll Bookshop Includes
  As a user of Jekyll with Bookshop
  I want includes scoped to the bookshop
  So that I can use them on the site or in components

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

  Scenario: Basic Bookshop Include
    Given a component-lib/shared/jekyll/basic.jekyll.html file containing:
      """
      {{include.label}}🎉
      """
    Given a component-lib/components/block/block.jekyll.html file containing:
      """
      <div>Block—{% bookshop_include basic label=include.title %}</div>
      """
    And a site/index.html file containing:
      """
      ---
      ---
      {% bookshop block title="Component" %}
      <span>Inline—{% bookshop_include basic label="Site" %}</span>
      """
    When I run "bundle exec jekyll build" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/index.html should contain the text "Block—Component🎉"
    And site/_site/index.html should contain the text "Inline—Site🎉"
