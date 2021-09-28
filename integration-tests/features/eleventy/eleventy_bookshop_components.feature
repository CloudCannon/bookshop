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
        package.json from starters/eleventy/package.json # <-- this .json line hurts my syntax highlighting
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

  Scenario: Eleventy components can use further Eleventy components
    Given a component-lib/components/hero/hero.eleventy.liquid file containing:
      """
      <h1>{{ text }}</h1>
      {% bookshop "tag" tagprop: herotag %}
      """
    And a component-lib/components/tag/tag.eleventy.liquid file containing:
      """
      <span>{{ tagprop.label }}</span>
      """
    And a site/index.html file containing:
      """
      ---
      title_text: "🩳"
      hero:
        tag:
          label: "🪣"
      ---
      {% bookshop "hero" text: title_text herotag: hero.tag %}
      """
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And stdout should contain "v0.12.1"
    And site/_site/index.html should contain the text "<h1>🩳</h1>"
    And site/_site/index.html should contain the text "<span>🪣</span>"

  Scenario: Eleventy bookshop tags can use the bind syntax
    Given a component-lib/components/card/card.eleventy.liquid file containing:
      """
      <h1>{{ title }}</h1>
      <p>{{ description }}</p>
      """
    And a site/index.html file containing:
      """
      ---
      card:
        title: "🧻"
        description: "⛳"
      ---
      {% bookshop "card" bind: card %}
      """
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And stdout should contain "v0.12.1"
    And site/_site/index.html should contain the text "<h1>🧻</h1>"
    And site/_site/index.html should contain the text "<p>⛳</p>"

  Scenario: Eleventy bookshop tags should support dynamic names
    Given a component-lib/components/a/a.eleventy.liquid file containing "🅰️{{e}}"
    And a component-lib/components/b/b.eleventy.liquid file containing "🅱️{{e}}"
    And a site/index.html file containing:
      """
      ---
      components:
        - _name: a
          e: 🫀
        - _name: b
          e: 🫑
      ---
      {% for component in components %}
      {% bookshop {{component._name}} bind: component %}
      {% endfor %}
      """
    When I run "npm install && npm start" in the site directory
    Then stderr should be empty
    And stdout should contain "v0.12.1"
    And site/_site/index.html should contain the text "🅰️🫀"
    And site/_site/index.html should contain the text "🅱️🫑"
