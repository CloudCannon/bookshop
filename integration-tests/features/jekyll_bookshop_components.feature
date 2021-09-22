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

  Scenario: Jekyll components can use further Jekyll components
    Given a component-lib/components/hero/hero.jekyll.html file containing:
      """
      <h1>{{ include.text }}</h1>
      {% bookshop tag tag=include.tag %}
      """
    And a component-lib/components/tag/tag.jekyll.html file containing:
      """
      <span>{{ include.tag.label }}</span>
      """
    And a site/index.html file containing:
      """
      ---
      title_text: "🩳"
      tag:
        label: "🪣"
      ---
      {% bookshop hero text=page.title_text tag=page.tag %}
      """
    When I run "bundle exec jekyll build" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/index.html should contain the text "<h1>🩳</h1>"
    And site/_site/index.html should contain the text "<span>🪣</span>"

  Scenario: Jekyll bookshop tags can use the bind syntax
    Given a component-lib/components/card/card.jekyll.html file containing:
      """
      <h1>{{ include.title }}</h1>
      <p>{{ include.description }}</p>
      """
    And a site/index.html file containing:
      """
      ---
      card:
        title: "🧻"
        description: "⛳"
      ---
      {% bookshop card bind=page.card %}
      """
    When I run "bundle exec jekyll build" in the site directory
    Then stderr should be empty
    And stdout should contain "Bookshop site data generated"
    And site/_site/index.html should contain the text "<h1>🧻</h1>"
    And site/_site/index.html should contain the text "<p>⛳</p>"
