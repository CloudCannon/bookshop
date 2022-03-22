@jekyll
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

  Scenario: Tests are functional
    Given a site/index.html file containing:
      """
      ---
      ---
      <h1>Hello World!</h1>
      """
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/index.html should contain the text "Hello World"

  Scenario: Components are rendered from bookshop
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
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/index.html should contain the text "Bookshop: Result 🧄"

  Scenario: Components can use the page front matter
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
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/index.html should contain the text "Bookshop: Result 👍"

  Scenario: Components can use further components
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
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/index.html should contain the text "<h1>🩳</h1>"
    And site/_site/index.html should contain the text "<span>🪣</span>"

  Scenario: Bookshop tags can use the bind syntax
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
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/index.html should contain the text "<h1>🧻</h1>"
    And site/_site/index.html should contain the text "<p>⛳</p>"

  Scenario: Bookshop tags should support dynamic names
    Given a component-lib/components/a/a.jekyll.html file containing "🅰️{{include.e}}"
    And a component-lib/components/b/b.jekyll.html file containing "🅱️{{include.e}}"
    And a site/index.html file containing:
      """
      ---
      components:
        - _name: a
          e: 🫀
        - _name: b
          e: 🫑
      ---
      {% for component in page.components %}
      {% bookshop {{component._name}} bind=component %}
      {% endfor %}
      """
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/index.html should contain the text "🅰️🫀"
    And site/_site/index.html should contain the text "🅱️🫑"

  Scenario: Bookshop page building components should work
    Given a component-lib/components/page/page.jekyll.html file containing:
      """
      {% for props in include.column_contents %}
        {% bookshop {{props._bookshop_name}} bind=props %}
      {% endfor %}
      """
    And a component-lib/components/tag/tag.jekyll.html file containing "tag-{{include.tag}}-tag"
    And a site/index.html file containing:
      """
      ---
      components:
        - _bookshop_name: page
          column_contents:
            - _bookshop_name: tag
              tag: "contents"
            - _bookshop_name: tag
              tag: "another"
      ---
      {% for component in page.components %}
      {% bookshop {{component._bookshop_name}} bind=component %}
      {% endfor %}
      """
    When I run "bundle exec jekyll build --trace" in the site directory
    Then stderr should be empty
    And stdout should contain "done in"
    And site/_site/index.html should contain the text "tag-contents-tag"
    And site/_site/index.html should contain the text "tag-another-tag"

