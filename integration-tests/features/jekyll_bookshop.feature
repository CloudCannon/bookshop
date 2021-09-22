Feature: Basic Jekyll Bookshop
  As a user of Jekyll with Bookshop
  I want to be able to use components
  So that I can build my site

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

  Scenario: Jekyll tests are functional
    Given a site/index.html file containing:
      """
      ---
      ---
      <h1>Hello World!</h1>
      """
    When I run "bundle exec jekyll build" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/index.html should contain the text "Hello World"

  Scenario: Jekyll components are rendered from bookshop
    Given a component-lib/components/title/title.jekyll.html file containing:
      """
      <h1>Bookshop: {{ include.text }}</h1>
      """
    And a site/index.html file containing:
      """
      ---
      ---
      {% bookshop title text="Result 🧄" %}
      """
    When I run "bundle exec jekyll build" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/index.html should contain the text "Bookshop: Result 🧄"


  Scenario: Jekyll components can use the page front matter
    Given a component-lib/components/title/title.jekyll.html file containing:
      """
      <h1>Bookshop: {{ include.text }}</h1>
      """
    And a site/index.html file containing:
      """
      ---
      title_text: "Result 👍"
      ---
      {% bookshop title text=page.title_text %}
      """
    When I run "bundle exec jekyll build" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/index.html should contain the text "Bookshop: Result 👍"
