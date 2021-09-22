Feature: Basic Eleventy Bookshop
  As a user of Eleventy with Bookshop
  I want to be able to use components
  So that I can build my site

  Background:
    Given the file tree:
      """
      bookshop/
        bookshop.config.js from starters/eleventy/bookshop.config.js
      site/
        .eleventy.js from starters/eleventy/.eleventy.js
        .eleventyignore from starters/eleventy/.eleventyignore
        package.json from starters/eleventy/package.json
      """
    And a site/index.html file containing:
      """
      ---
      ---
      <h1>Hello World!</h1>
      """

  Scenario: Tests are functional
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And stdout should contain "v0.12.1"
    And site/_site/index.html should exist
    And site/_site/index.html should contain the text "Hello World"
