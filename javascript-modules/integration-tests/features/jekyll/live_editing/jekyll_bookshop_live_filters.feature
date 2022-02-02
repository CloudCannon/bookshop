@jekyll @web
Feature: Jekyll Bookshop CloudCannon Live Editing Filters and Functions

  Background:
    Given the file tree:
      """
      package.json from starters/generate/package.json # <-- this .json line hurts my syntax highlighting
      component-lib/
        bookshop/
          bookshop.config.js from starters/jekyll/bookshop.config.js
      site/
        _config.yml from starters/jekyll/_config.yml
        Gemfile from starters/jekyll/Gemfile.cloudcannon
        Gemfile.lock from starters/jekyll/Gemfile.cloudcannon.lock
        _layouts/
          default.html from starters/jekyll/default.html
      """

  Scenario: Bookshop live renders markdown
    Given a component-lib/components/beetroot/beetroot.jekyll.html file containing:
      """
      <div><code> {{ include.md | markdownify }} </code></div>
      """
    Given [front_matter]:
      """
      layout: default
      md: title
      """
    And a site/index.html file containing:
      """
      ---
      [front_matter]
      ---
      {% bookshop beetroot md=page.md %}
      """
    And 🌐 I have loaded my site in CloudCannon
    When 🌐 CloudCannon pushes new yaml:
      """
      md: "**bold** title"
      """
    Then 🌐 There should be no errors
    *    🌐 There should be no logs
    *    🌐 The selector code should match "<p><strong>bold</strong> title</p>"
  