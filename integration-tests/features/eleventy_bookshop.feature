Feature: Basic Eleventy Bookshop
  As a user of Eleventy with Bookshop
  I want to be able to use components
  So that I can build my site

  Background:
    Given the file tree:
      """
      component-lib/
        bookshop/
          bookshop.config.js from starters/eleventy/bookshop.config.js
      site/
        .eleventy.js from starters/eleventy/.eleventy.js
        .eleventyignore from starters/eleventy/.eleventyignore
        package.json from starters/eleventy/package.json
      """

  Scenario: Tests are functional
    Given a site/index.html file containing:
      """
      ---
      ---
      <h1>Hello World!</h1>
      """
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And stdout should contain "v0.12.1"
    And site/_site/index.html should contain the text "Hello World"


  Scenario: Eleventy components are rendered from bookshop
    Given a component-lib/components/title/title.eleventy.liquid file containing:
      """
      <h1>Bookshop: {{ text }}</h1>
      """
    And a site/index.html file containing:
      """
      ---
      ---
      {% bookshop "title" text: "Result 🤽‍♂️" %}
      """
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And stdout should contain "v0.12.1"
    And site/_site/index.html should contain the text "Bookshop: Result 🤽‍♂️"

  Scenario: Eleventy components can use the page front matter
    Given a component-lib/components/title/title.eleventy.liquid file containing:
      """
      <h1>Bookshop: {{ text }}</h1>
      """
    And a site/index.html file containing:
      """
      ---
      title_text: "Result 🛗"
      ---
      {% bookshop "title" text: title_text %}
      """
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And stdout should contain "v0.12.1"
    And site/_site/index.html should contain the text "Bookshop: Result 🛗"